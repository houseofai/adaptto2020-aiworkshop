AdaptTo() 2020 - Workshop 2nd part
======


1.) Data Science in AEM using Python with AEMpy
------

**Description**: The objective is to install a python environment to get familiar with the AEM python library: AEMpy

This procedure has been successfully tested on Linux, Mac, and Windows.

### 1.1 Installation

#### 1.1.1 Python
##### Checking Python installation

To check Python installation and version, type in your terminal:

 `python --version`

If the output is: ```Python 3.7.6```
then Python is installed on your system.

If the output is `command not found` (or any similar message), you need to install Python.

If the Python version is inferior to **3.5**, then you need to upgrade your Python version.

##### Install Python on Mac OS
To install Python on Mac OS, we use `brew`. If you don't have *brew* installed, please refer to the [official documentation](https://brew.sh) for the installation.

Install Python:

`brew install python`

Check python installation:

`python --version`

##### Install Python on Linux

#### 1.1.2 Package manager: Miniconda

Miniconda is a package manager for Python. It helps create a virtual environment to isolate package installation.

Miniconda installers documentation for Mac/Linux/Windows: https://docs.conda.io/en/latest/miniconda.html

Restart your terminal after the installation.


### 1.2 Start coding!

1. Start Python by typing in your terminal:
```
$ python
```

2. Once in the python interpreter:
```
# Import AEMpy library
import aempy
```

3. Connect and display the AEM version
```
# Connect to the AEM Instance
instance = aempy.AEM()
```
```
# Get the product information
productinfo = instance.info()
```
```
# Print the product version
print(productinfo.version)
```

4. Get the error logs
```
# Connect to the system console
system = aempy.System()
```
```
# Get the five first lines of the error.log file
errorlogs = system.log_error(5)
```
```
# Print the lines
print(errorlogs)
```

5. Parse the logs
```
# Let's get more line from error.log (default: 10.000 lines)
errorlogs = system.log_error()
```
We import a new library named **pandas** (it has nothing to do with the animal).
Pandas is a Data analysis and manipulation library, mainly using a data frame.
```
# Import Pandas library
import pandas as pd
```
 *Note: It is a good practice to have all the imports at the beginning of your python program. But for the comprehension of this tutorial, we added it here.*
```
# Split the logs and arrange in a table using the Pandas library
dfLog = pd.DataFrame([sub.split(" ") for sub in errorlogs])
```
```
# Add Names to the columns
dfLog = dfLog.rename(columns={0:'date',1:'time',2:'level',3:'ID',4:'class',5:'msg'})
```
```
# Print the parsed logs
`print(dfLog)`
```

6. Convert logs to a pandas Dataframe
```
# There is a builtin parsing in AEMpy to automatically convert logs to pandas data frame
dfErrors = system.log_to_pandas(errorlogs)
```
```
# Print the first 10 lines of the pandas dataframe
print(dfErrors.head())
```
```
# Ask pandas to describe the dataframe
print(dfErrors.describe())
```

7. Analyze the logs with the *ERROR* level
```
# Filter the logs by level
dfLevelError = dfErrors[dfErrors["level"].str.match("ERROR")]
# Add a title for the next actions
print("Information about log errors:")
```
```
# Display the first 5 lines of the dataframe
print(dfLevelError.head())
```
```
# Display the last 5 lines of the dataframe
print(dfLevelError.tail())
```
```
# Describe the table
print(dfLevelError.describe())
```
At this point, we have analyzed the error logs using a raw solution (without pandas) and parsed solution (with pandas) that gives us the possibility to do more in-depth analysis.
There are two problems with the python interpreter:
 - Once you have quit the interpreter, all your context is lost
 - You can not plot graph, which helps a lot to understand your data

## 2. Building Data Science Reports using AEM data and Jupyter Notebook

### 2.1 Installation
In the terminal, make sure you are in the right environment (e.g., conda environment)
```
conda install -c conda-forge notebook
```
Or
```
pip install notebook
```
When starting the Jupyter server, Jupyter's works folder is the current folder. So, if you want to save your work, make sure to be in an accessible folder.
Still from your terminal, type in:
```
# Start the Jupyter server
> jupyter notebook
```
Then Jupyter server starts, and it automatically opens a page on the browser, listing the current folder.

### 2.2 Import the Jupyter Notebook

Download the Jupyter notebook from:
> https://raw.githubusercontent.com/OdysseeT/aempy/master/examples/AEMpy_Basics.ipynb

From Jupyter,

![text](./imgs/upload.png "Jupyter - Upload")
