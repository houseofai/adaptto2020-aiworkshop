'use strict';

const { worker, SourceCorruptError } = require('@adobe/asset-compute-sdk');
const { serializeXmp } = require('@adobe/asset-compute-xmp');
const axios = require('axios');

const path = require('path');
const { createReadStream } = require('fs');
const fs = require('fs').promises;
const FormData = require('form-data');

const DEFAULT_ANALYZER_ID = 'Feature:image-color-histogram:Service-e952f4acd7c2425199b476a2eb459635';
const DEFAULT_CCAI_ENDPOINT = 'https://sensei.adobe.io/services/v1/predict';

function parseColorNames(response) {
    const feature_response =
        response.cas_responses &&
        response.cas_responses[0] &&
        response.cas_responses[0].result &&
        response.cas_responses[0].result.response &&
        response.cas_responses[0].result.response[0];

    const tags = [];
    if (
        feature_response &&
        feature_response.feature_name === 'color' &&
        Array.isArray(feature_response.feature_value)
    ) {
        for (const tag of feature_response.feature_value) {
            const [name] = tag.feature_value.split(',');
            tags.push(name);
        }
    } else {
        throw Error(`Response not supported: ${JSON.stringify(response)}`);
    }
    return tags;
}

exports.main = worker(async (source, rendition, params) => {
    // Acquire end point and analyzer
    const analyzerId = rendition.instructions.ANALYZER_ID || DEFAULT_ANALYZER_ID;
    const ccaiEndpoint = rendition.instructions.CCAI_ENDPOINT || DEFAULT_CCAI_ENDPOINT;
    console.log('Using analyzer:', analyzerId);
    console.log('Using endpoint:', ccaiEndpoint);

    // Make sure that the source file is not empty
    const stats = await fs.stat(source.path);
    if (stats.size === 0) {
        throw new SourceCorruptError('source file is empty');
    }

    // Build parameters to send to Sensei service
    const ext = path.extname(source.path);
    const senseiParams = {
        'application-id': '1234',
        'content-type': 'inline',
        encoding: ext,
        threshold: '0',
        'top-N': '0',
        custom: {},
        data: [
            {
                'content-id': '0987',
                content: 'inline-image',
                'content-type': 'inline',
                encoding: ext,
                threshold: '0',
                'top-N': '0',
                'historic-metadata': [],
                custom: { exclude_mask: 1 },
            },
        ],
    };
    if (rendition.instructions.SENSEI_PARAMS) {
        senseiParams = JSON.parse(rendition.instructions.SENSEI_PARAMS);
        senseiParams.encoding = ext;
        senseiParams.data[0].encoding = ext;
    }

    // Build form to post
    const formData = new FormData();
    formData.append('file', createReadStream(source.path));
    formData.append(
        'contentAnalyzerRequests',
        JSON.stringify({
            enable_diagnostics: true,
            requests: [
                {
                    analyzer_id: analyzerId,
                    parameters: senseiParams,
                },
            ],
        })
    );

    // Execute request
    const response = await axios.post(ccaiEndpoint, formData, {
        headers: Object.assign(
            {
                Authorization: 'Bearer ' + params.auth.accessToken,
                'cache-control': 'no-cache,no-cache',
                'Content-Type': 'multipart/form-data',
                'x-api-key': params.auth.clientId,
            },
            formData.getHeaders()
        ),
    });

    // Convert color features to tags
    const colorNames = parseColorNames(response.data);
    const xmp = serializeXmp(
        {
            'ccai:colorExtractionArray': colorNames,
            'ccai:colorExtraction': colorNames.join(' '),
        },
        {
            namespaces: {
                ccai: 'https://example.com/schema/ccai',
            },
        }
    );

    // Write XMP metadata as output
    await fs.writeFile(rendition.path, xmp);
});
