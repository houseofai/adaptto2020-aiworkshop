# DAM in AN AI First World Tech Lab Adapt To 2020 - Instruction 

## Adding Credentials - Custom Worker Contd

Since you logged in during app creation, most of the credentials are already collected in your `.env` file. You only need to add a few credentials needed for the [developer tool](https://git.corp.adobe.com/nui/nui/blob/master/doc/developer/CustomWorkerDeveloperGuide.md#developer-tool-credentials).

*If you did not log in, read this document to [set up credentials manually](https://git.corp.adobe.com/nui/nui/blob/master/doc/developer/SettingUpCredentialsManually.md).*

#### Developer Tool Credentials

**Pre-requisite**: Make sure to have access to a cloud storage container. Currently, we only support Azure Blob Storage and AWS S3.

*Note: This can be a shared container used by multiple developers across different projects.*

Add the following credentials to the `.env` file in the root of your Firefly project:

1. Add the absolute path to the private key file created while adding services to your Firefly Project:

   ```
   ASSET_COMPUTE_PRIVATE_KEY_FILE_PATH=
   ```

2. Add either S3 or Azure Storage credentials. (You only need access to one cloud storage solution(if you have ,else use the below credential)):

   ```
   # S3 credentials
   S3_BUCKET=
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_REGION=
   
   # Azure Storage credentials
   AZURE_STORAGE_ACCOUNT=sanmishrblobs
   AZURE_STORAGE_KEY='D0IISFPFe4tp1IGbl9r8ZrZSCNBDbJVhHHa0icRU2Nm5AIa6TKMkaRJkxB7NupIAIuwHNvP6qKEVOGe9I4emoA=='
   AZURE_STORAGE_CONTAINER_NAME=adapttoblobs
   ```

### Local Development

#### Running the Application

##### **Pre-requisites**:

- Make sure to properly configure the [development tool credentials](https://git.corp.adobe.com/nui/nui/blob/master/doc/developer/CustomWorkerDeveloperGuide.md#developer-tool-credentials) in the `.env` file.
- Make sure to have [docker desktop](https://www.docker.com/products/docker-desktop) installed and running on your machine. You need docker running to run the worker tests

To run the application, use the following command:

```
aio app run
```

This will deploy the action to Adobe I/O Runtime and start the development tool on your local machine. This tool is used for testing worker requests during development. Here is an example rendition request:

```
"renditions": [
    {
        "worker": "https://1234_my_namespace.adobeioruntime.net/api/v1/web/example-custom-worker-master/worker",
        "name": "image.jpg"
    }
]
```

*Note: Do not use the `--local` flag with the run command. It does not work with Asset Compute custom workers and the Asset Compute Developer Tool. Custom workers are invoked by the Asset Compute Service which cannot access actions running on developer's local machines.*

#### Debug

#### Test

To test the worker, run the following command:

```
aio app test
```

#### Adding Worker Tests

To add additional worker tests, follow the guidlines [here](https://git.corp.adobe.com/nui/nui/blob/master/doc/developer/AddWorkerTests.md)

#### Deploy (This is not required for this lab)

To deploy the worker, run the following command (This is not required for this lab):

```
aio app deploy
```