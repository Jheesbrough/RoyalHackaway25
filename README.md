# Royal Hackaway

## Installation

To use the self-evolving API, run the server with:

```bash
npm install
```

## Usage

After installing the dependencies, start the server by running:

```bash
node server.js
```

### API Endpoints

The following API endpoints are available:

- **POST /evolve**
  - **Description:** Opens an issue on the repo with an improvement that can be made.
  - **Expected Input:** A JSON object with details about the improvement.
    - Example:
      ```json
      {
        "improvement": "Add more tests for the API endpoints."
      }
      ```
  - **Expected Output:** A confirmation message with the issue details.
    - Example:
      ```json
      {
        "message": "Issue created successfully.",
        "issue": {
          "id": 1,
          "title": "Add more tests for the API endpoints."
        }
      }
      ```

- **POST /work-on-issue**
  - **Description:** Takes the most recent issue and opens a pull request to work on it.
  - **Expected Input:** A JSON object with the pull request details.
    - Example:
      ```json
      {
        "title": "Implement tests for API",
        "body": "This pull request addresses the issue of lacking tests."
      }
      ```
  - **Expected Output:** A confirmation message with the pull request details.
    - Example:
      ```json
      {
        "message": "Pull request created successfully.",
        "pull_request": {
          "id": 101,
          "title": "Implement tests for API"
        }
      }
      ``` 


Running the python serial listener:

```bash
py -m env venv
.\venv\Scripts\activate
pip install -r requirements.txt
python serial_listener.py
```

### Running the discord bot
```bash
npm install
nodemon server.js
```

e

website got 'optimised.design' domain name
