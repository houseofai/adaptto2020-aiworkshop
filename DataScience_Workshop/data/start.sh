#!/bin/sh

nohup jupyter notebook --no-browser --ip=0.0.0.0 --allow-root --NotebookApp.token='' --notebook-dir=/workspace/notebook &


cd /workspace/AEM/
nohup ./crx-quickstart/bin/start &
cd /workspace
