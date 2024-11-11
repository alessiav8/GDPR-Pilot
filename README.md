# GDPR Pilot

This repository contains the codebase for my Master's thesis in the Computer Science Engineering program at Sapienza University. The GDPR-Pilot tool extends BPMN.io, allowing users to create and edit process models. It asks ten questions to check if any parts of a process do not meet GDPR rules. If a problem is found, the tool automatically adds a predefined pattern to fix it. The tool also uses an LLM to generate helpful suggestions to guide users in answering the ten questions.

## Installation

Before starting the installation you need to add an OpenAI API Key (preferably for GPT-3.5) in the .env file located inside the src/js folder in the field API_KEY.  
Here you can find information about the OpenAI API [https://openai.com/index/openai-api/](https://openai.com/index/openai-api/)

If you don't have concurrently installed, you need to install it: <br>
`npm install concurrently --save-dev` <br>

Run the following command to start the tool:<br>
`npm run dev`

## Contributions

- **Prof. Andrea Marrella**
- **Prof. Simone Agostinelli**

## License

The code of this project is released under the [MIT License](./LICENSE.md), which you can find in the LICENSE.md file.

## Contacts

Email: alessia.volpi.28@gmail.com
