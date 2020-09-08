FROM openjdk:11

RUN apt-get update

# Install Python, pip3
RUN apt-get -y install python3 python3-pip

# Set python 3 as default version
RUN /usr/bin/update-alternatives --install /usr/bin/python python /usr/bin/python3.7 1
RUN /usr/bin/update-alternatives --install /usr/bin/python python /usr/bin/python2.7 2
RUN /usr/bin/update-alternatives --set python /usr/bin/python3.7

# Install Jupyter
RUN pip3 install jupyter

# Install AEMpy
RUN pip3 install git+https://github.com/houseofai/aempy.git pandas mxnet matplotlib seaborn gluonts

WORKDIR /workspace
COPY . .

# Run Jupyter
EXPOSE 8888

# Run AEM
EXPOSE 4502
