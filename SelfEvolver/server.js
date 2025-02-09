const express = require("express");
const { Octokit } = require("@octokit/core");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

const openai = new OpenAI({
  organization: "org-vO7HOgw962jSFAyT3OYQuLk7",
  project: "proj_b1HjBJVtjOi4YXKvPRdPzUdv",
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function fetchAllFiles(owner, repo, filePath = "") {
  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo,
      path: filePath,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  let files = [];
  for (const item of response.data) {
    if (item.type === "file") {
      files.push({ name: item.name, path: item.path });
    } else if (item.type === "dir") {
      const subFiles = await fetchAllFiles(owner, repo, item.path);
      files = files.concat(subFiles);
    }
  }
  // Remove all files ending in banned extensions and everything starting in .
  const bannedExtension = [".json",".class",".iml",".xml"];

  files = files.filter((file) => {
    return (
      !bannedExtension.includes(path.extname(file.name)) &&
      !file.name.startsWith(".")
    );
  });

  if (!files.length) {
    return [];
  }

  return files;
}

app.post("/evolve", async (req, res) => {
  try {
    // Fetch all files from the GitHub repository recursively
    let files = await fetchAllFiles("NeverHave1Ever2", "RoyalHackaway25");

    // Select a random file and read its content
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const fileContentResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "NeverHave1Ever2",
        repo: "RoyalHackaway25",
        path: randomFile.path,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const fileContent = Buffer.from(
      fileContentResponse.data.content,
      "base64"
    ).toString("utf-8");
    const fileName = randomFile.name;

    // Use OpenAI to generate an issue based on the file content
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a GitHub bot that creates an issue based off code. Always return JSON with a title and body field. For example, { "title": "Issue title", "body": "Issue body" }. Do not put it in a code block',
        },
        {
          role: "user",
          content: `Create a short and quick GitHub issue in order to improve the following code:\n\n${fileContent}. Include reference to the name of the file in the issue title, which is ${fileName}.`,
        },
      ],
      max_tokens: 400,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    const issue = openAIResponse.choices[0].message.content;

    // Parse the issue title and body from the generated response
    let issueJSON = {};
    try {
      issueJSON = JSON.parse(issue);
    } catch (error) {
      console.error("Error parsing issue JSON:", error.message);
      console.log("Issue:", issue);
      return res
        .status(500)
        .send({ error: 'Error parsing issue JSON "' + error.message + '"' });
    }

    const issueTitle = issueJSON.title;
    const issueBody = issueJSON.body;

    // Create an issue on GitHub
    await octokit.request("POST /repos/{owner}/{repo}/issues", {
      owner: "NeverHave1Ever2",
      repo: "RoyalHackaway25",
      title: issueTitle,
      body: issueBody,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    res.send({ message: "Issue created successfully" });
  } catch (error) {
    console.error("Error creating issue:", error.message);
    res
      .status(500)
      .send({ error: 'Error creating issue "' + error.message + '"' });
  }
});

app.post("/work-on-issue", async (req, res) => {
  try {
    // Fetch the latest open issue
    const issuesResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/issues",
      {
        owner: "NeverHave1Ever2",
        repo: "RoyalHackaway25",
        state: "open",
        per_page: 1,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!issuesResponse.data.length) {
      return res.status(404).send({ error: "No open issues found" });
    }

    const issue = issuesResponse.data[0];
    const branchName = issue.title.replace(/\s+/g, "-").toLowerCase();

    // Create a new branch for the issue
    const mainBranchResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/git/refs/heads/main",
      {
        owner: "NeverHave1Ever2",
        repo: "RoyalHackaway25",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const mainBranchSha = mainBranchResponse.data.object.sha;

    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner: "NeverHave1Ever2",
      repo: "RoyalHackaway25",
      ref: `refs/heads/${branchName}`,
      sha: mainBranchSha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    // Fetch all files from the GitHub repository recursively
    let files = await fetchAllFiles("NeverHave1Ever2", "RoyalHackaway25");


    // Select a file using openAI to choose based on the issue title
    const openAIFileResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You are a GitHub bot that chooses a file to work on based on the issue title. Always return the name of the file to work on. Return it in JSON format with a "file" field. For example, { "file": "path/file-name.js" }',
        },
        {
          role: "user",
          content: `Choose a file to work on based on the issue title: ${
            issue.title
          }. The files available are: ${files
            .map((file) => file.path)
            .join(", ")}.`,
        },
      ],
      max_tokens: 200,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    const fileJSON = JSON.parse(openAIFileResponse.choices[0].message.content);
    const filePath = fileJSON.file;

    console.log(
      "All files:",
      files.map((file) => file.name)
    );
    console.log("Selected file:", filePath);

    // Read the content of the selected file
    const fileContentResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "NeverHave1Ever2",
        repo: "RoyalHackaway25",
        path: filePath,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const fileContent = Buffer.from(
      fileContentResponse.data.content,
      "base64"
    ).toString("utf-8");

    // Use OpenAI to generate code changes
    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a GitHub bot that modifies code based on an issue description. Always return the modified code. Do not return any other text apart from the new file, as it will be written directly into the file. Do not include codeblocks in the response, just the raw code.",
        },
        {
          role: "user",
          content: `Modify the following code based on the issue description:\n\n${fileContent}\n\nIssue description: ${issue.body}`,
        },
      ],
      max_tokens: 1000,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    const updatedContent = openAIResponse.choices[0].message.content;
    const updatedContentBase64 = Buffer.from(updatedContent).toString("base64");

    // Update the file content in the new branch
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: "NeverHave1Ever2",
      repo: "RoyalHackaway25",
      path: filePath,
      message: `Fix for issue #${issue.number}`,
      content: updatedContentBase64,
      branch: branchName,
      sha: fileContentResponse.data.sha,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    // Open a pull request
    await octokit.request("POST /repos/{owner}/{repo}/pulls", {
      owner: "NeverHave1Ever2",
      repo: "RoyalHackaway25",
      title: `Fix for issue #${issue.number}`,
      head: branchName,
      base: "main",
      body: `This pull request addresses issue #${issue.number}.`,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    res.send({ message: "Pull request created successfully" });
  } catch (error) {
    console.error("Error working on issue:", error.message);
    res
      .status(500)
      .send({ error: 'Error working on issue "' + error.message + '"' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
