# Steps to build and run a CTF

## Pre-work 
*Already done in this repository in the [CTF_Data](CTF_Data) directory* 

### Extract Challenges
Use the `juice-shop-cli` to generate a backup file of the Juice Shop challenges from an instance of Juice Shop. See [Generating challenge import files with juice-ship-ctf-cli](https://help.owasp-juice.shop/part1/ctf.html)

```
npm install -g juice-shop-ctf-cli
```

and run the tool with

```
juice-shop-ctf
```

Select the options: 
* CTF framework to generate data for? **CTFd**
* Juice Shop URL to retrieve challenges? **http://localhost:8390**
* Secret key <or> URL to ctf.key file? **L33tC0d!er**
* Insert a text hint along with each challenge? **Paid text hints**
* Insert a hint URL along with each challenge? **No hint URLs**
* Insert a code snippet as hint for each challenge? **Paid hint snippets**

### Convert Challenege/Hint JSON To YAML

Decompress the zip file from ``juice-shop-ctf`` to a working folder then use [yfromjs.js](scripts/yfromjs.js) to convert the challenges, flags, hints and tags to a single YAML file for easier editing and modification of challenges.

```
node yfromjs.js --challenges <challenges.json file> --flags <flags.json file> --hints <hints.json file> --tags <tags.json file> --output <YAML file to write>
```

### Baseline CTFd Configration Data

Configure the skeleton of a CTFd instance with an admin user and any baseline configuration options, download a backup of the configuration data and copy the json data files to a (staging directory)[CTF_Data/staging] 

## Constructing a CTF

### Challenges
*Initial versions in the (CTF_Data/data)[CTF_Data/data] directory in this repository.*

Create one or more YAML files that contain data elements to define the challenges for your CTF. 

| Element | Description |
| ------- | ----------- |
| name         | The name of the challenge |
| description  | Text of the challenge |
| max_attempts | How many times a player can attempt the challenge |
| value        | The number of points for solving the challenge |
| category     | Category of the challenge |
| type         | Challenge type, usually **standard** |
| state        | Challenge state, usually **visible** |
| flags        | Flags associated with the challenge |
| hints        | Hints for the challenge |
| tags         | Tags associated with the challenge |

### Pages

Create any number of HTML and/or Markdown files that contain the content of pages that you want added to your CTF instance. The base file name is the name of the page.

### Automation

To update CTF challenges with content from the challenge YAML files run the (ctfdFromYaml.js)[scripts/ctfdFromYaml.js] script to parse the given YAML files (from *--folder* or *--input* options) and create the relevant CTFd JSON files in the *output* folder. The script will also parse all HTML and Markdown files in the *--pages* folder and update the CTFd pages.json file as appropriate.


```
node ctfdFromYaml.js --folder ..\CTF_Data\data --pages ..\CTF_Data\data\pages --output ..\CTF_Data\staging\db
```

Once the CTFd files have been generated, create an archive of the *db* directory, name the archive **export.zip** and use that file as your import source for the CTFd instance.

```
node createExport.js --input ..\CTF_Data\staging --output ..\.data\CTFd\events\BASC\export.zip
```


#### Update LLM CTF Prommts

Copy the challenge/prompt data file to the LLM CTF data directory.

```
copy ..\CTF_Data\data\llm.yml ..\.data\llmctf\data
```
