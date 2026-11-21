import type { TrackData } from '../context/LevelContext';

export const DEFAULT_SUGGESTED_ROUTE: string[] = [
  "B1",
  "M1",
  "G1",
  "A1",
  "D1"
];

export const DEFAULT_TRACKS: TrackData[] = [
  {
    "id": "builder",
    "name": "Builder Track",
    "subtitle": "Data Logic Engine",
    "color": "#3B82F6",
    "icon": "\ud83d\udd35",
    "description": "Build deterministic data pipelines. No ML yet \u2014 just pure logic.",
    "what_you_build": "A complete data validation and transformation pipeline.",
    "what_you_learn": [
      "Schema validation",
      "Constraint logic",
      "Pipeline composition",
      "Batch processing"
    ],
    "why_it_matters": "Every AI system starts with reliable data infrastructure.",
    "levels": [
      {
        "level_id": "B1",
        "track": "builder",
        "level_title": "Schema Validator Engine",
        "resource_link": "https://json-schema.org/understanding-json-schema",
        "resource_links": [
          {
            "title": "Understanding JSON Schema",
            "link": "https://json-schema.org/understanding-json-schema"
          },
          {
            "title": "Pydantic Schemas",
            "link": "https://docs.pydantic.dev/latest/usage/schema/"
          }
        ],
        "execution_mode": "code",
        "input_contract": {
          "type": "code",
          "language": "python",
          "description": "Python code that reads a JSON file and validates it against a schema."
        },
        "output_contract": {
          "type": "json",
          "schema": {
            "valid": "boolean",
            "errors": "list[str]",
            "fields_checked": "int"
          }
        },
        "goal": "Build a recursive schema validator that handles nested objects, arrays, type checking, and required field enforcement.",
        "system_context": "You're building the first component of a data ingestion pipeline. Before any data enters your system, it must be validated against a strict schema. This isn't a simple type-check \u2014 real schemas have nested objects, optional fields, and array constraints.",
        "user_task": "Write a Python program that:\n1. Reads 'schema.json' and 'data.json'\n2. Validates data against schema recursively\n3. Checks required fields, types (string, int, float, bool, list, dict)\n4. Prints JSON: {\"valid\": bool, \"errors\": [], \"fields_checked\": int}",
        "protected_code": "# --- DATA LOADING --- (DO NOT MODIFY)\nwith open(\"schema.json\", \"r\") as f: schema = json.load(f)\nwith open(\"data.json\", \"r\") as f: data = json.load(f)\n# ------------------------------------\n\n# --- FINAL EVALUATION --- (DO NOT MODIFY)\nerrors, fields_checked = validate(data, schema)\nprint(json.dumps({\"valid\": len(errors)==0, \"errors\": errors, \"fields_checked\": fields_checked}))\n# ------------------------",
        "initial_code": "import json\nimport sys\n\ndef validate(data, schema, path=\"root\"):\n    errors = []\n    fields_checked = 0\n    # TODO: 1. If schema has 'required' fields, check they exist in data\n    # TODO: 2. If schema has 'properties', validate each property recursively\n    # TODO: 3. Check types (string, int, float, bool, list, dict) using isinstance\n    # TODO: 4. Handle nested objects and arrays of items\n    return errors, fields_checked\n\n# --- DATA LOADING --- (DO NOT MODIFY)\nwith open(\"schema.json\", \"r\") as f: schema = json.load(f)\nwith open(\"data.json\", \"r\") as f: data = json.load(f)\n# ------------------------------------\n\n# TODO: Call validate() and report results\n\n# --- FINAL EVALUATION --- (DO NOT MODIFY)\nerrors, fields_checked = validate(data, schema)\nprint(json.dumps({\"valid\": len(errors)==0, \"errors\": errors, \"fields_checked\": fields_checked}))\n# ------------------------",
        "failure_cases": [
          "Flat validators that don't recurse into nested objects",
          "Missing array element type checking",
          "Hardcoded outputs \u2014 3 different datasets make this impossible"
        ],
        "hint_system": [
          {
            "unlock_after_attempts": 3,
            "hint": "Think recursively: when you encounter a property with type 'object', you need to validate its sub-properties too."
          },
          {
            "unlock_after_attempts": 5,
            "hint": "Required fields: iterate schema['required'] and check existence in data at every nesting level."
          }
        ],
        "why_this_matters": "Schema validation is the first line of defense in any data pipeline. Malformed data causes silent downstream failures.",
        "example_input": {
          "schema.json": "{\n  \"type\": \"object\",\n  \"required\": [\"name\", \"age\"],\n  \"properties\": {\n    \"name\": {\"type\": \"string\"},\n    \"age\": {\"type\": \"int\"}\n  }\n}",
          "data.json": "{\n  \"name\": \"Alice\",\n  \"age\": 30\n}"
        },
        "guide_markdown": "# Schema Validator Engine (B1)\n\n## Overview\n\nIn the world of high-velocity data, the first line of defense is **Verification**. You cannot process data reliably if you do not understand its structure.\n\nIn this challenge, you will implement a recursive validator that ensures incoming data packets strictly adhere to a predefined set of rules. This is the foundation upon which every reliable ML pipeline is built.\n\n---\n\n## Core Concepts\n\n*   **Recursive Navigation**: Real-world data is rarely flat. Your logic must be able to \"dive\" into nested dictionaries and lists to validate every level of the object.\n*   **Strict Typing**: Verify that `string` is actually a string and `int` is actually an integer using safe type-checking methods.\n*   **Constraint Checking**: \n    1.  **Required Fields**: Are the mandatory keys present?\n    2.  **Property Matching**: Does the content of the keys match the schema definitions?\n*   **Error Reporting**: Collect all structural failures into a single report rather than stopping at the first error.\n\n---\n\n## Implementation Guide\n\nFollow this blueprint to build your validator:\n\n1.  **Define the Base Case**: Start by checking if the current schema part has a `type`.\n2.  **Handle Objects**:\n    *   Iterate through the `required` list. If a key is missing in the data, log it.\n    *   Iterate through `properties`. For each key found in the data, call your `validate()` function again (recursion).\n3.  **Handle Arrays**:\n    *   If the type is `list`, iterate through every item.\n    *   Validate each item against the `items` schema provided.\n4.  **Type Guarding**: Use `isinstance(data, target_type)` to verify types. Map schema type strings (e.g., `\"string\"`) to Python types (`str`).\n\n---\n\n## \ud83d\udca1 Tip: Local Development\n\nTesting recursive functions is much easier in a local IDE with a debugger. \n\n*   Create a simple `schema.json` with one nested object.\n*   Run your script and set a breakpoint inside the `validate` function.\n*   Watch how the `path` variable changes as the function calls itself!\n",
        "evaluation_type": "multi_dataset",
        "has_training_dataset": false,
        "unlocked": true
      }
    ]
  },
  {
    "id": "ml_pipeline",
    "name": "ML Pipeline Track",
    "subtitle": "Core ML System",
    "color": "#22C55E",
    "icon": "\ud83d\udfe2",
    "description": "Real ML engineering \u2014 distributions, leakage, adversarial thinking.",
    "what_you_build": "A production-grade ML training and inference system.",
    "what_you_learn": [
      "Distribution analysis",
      "Data leakage detection",
      "Feature stability",
      "Model robustness"
    ],
    "why_it_matters": "ML models fail silently. This track teaches you to catch failures before they ship.",
    "levels": [
      {
        "level_id": "M1",
        "track": "ml_pipeline",
        "level_title": "Data Anomaly & Drift Detector",
        "resource_link": "https://www.mathworks.com/help/risk/credit-scorecard-monitoring.html",
        "resource_links": [
          {
            "title": "PSI & Characteristic Analysis",
            "link": "https://www.mathworks.com/help/risk/credit-scorecard-monitoring.html"
          },
          {
            "title": "Data Drift Overview",
            "link": "https://docs.evidentlyai.com/metrics/explainer_drift"
          }
        ],
        "execution_mode": "code",
        "input_contract": {
          "type": "code",
          "language": "python",
          "description": "Detect anomalies and drift in datasets."
        },
        "output_contract": {
          "type": "json",
          "schema": {
            "anomalies": "list[dict]",
            "drift_detected": "boolean",
            "summary_stats": "dict"
          }
        },
        "goal": "Detect anomalies in training data using IQR, and flag drift between train/test sets using median comparison.",
        "system_context": "You're the first ML engineer on a new project. Before training any model, understand your data. Train/test sets collected at different times may have drift or anomalies that silently degrade model performance.\n\n\ud83d\udca1 Tip: You can develop and test your code in a local IDE, then paste the working solution here.",
        "user_task": "Write Python that reads 'train.csv' and 'test.csv'. For each numeric column:\n1. Detect anomalies using IQR: Q1 = 25th percentile, Q3 = 75th percentile, IQR = Q3-Q1. Any value < Q1-1.5*IQR or > Q3+1.5*IQR is an anomaly.\n2. Compare train vs test medians: if |(train_median - test_median) / train_median| > 0.2, that column has drifted.\n\nPrint JSON: {\"anomalies\": [{\"column\": str, \"value\": float, \"row_id\": int}], \"drift_detected\": bool, \"summary_stats\": {\"total_rows_train\": N, \"total_rows_test\": N, \"drifted_columns\": []}}. Use ONLY stdlib (no sklearn/scipy/pandas).",
        "protected_code": "def read_csv(fn):\n    with open(fn) as f: return list(csv.DictReader(f))\n\n# --- FINAL OUTPUT --- (DO NOT MODIFY)\nprint(json.dumps({\"anomalies\": anomalies, \"drift_detected\": drift_detected, \"summary_stats\": summary_stats}))\n# --------------------",
        "initial_code": "import json\nimport csv\nimport math\n\n# --- HELPERS --- (DO NOT MODIFY THIS BLOCK)\ndef read_csv(fn):\n    with open(fn) as f: return list(csv.DictReader(f))\n# ------------------------------------------\n\n# TODO: 1. Detect anomalies using IQR (Q1 - 1.5*IQR, Q3 + 1.5*IQR)\n# TODO: 2. Detect drift between train/test median (>20% relative shift)\n\ntrain = read_csv('train.csv')\ntest = read_csv('test.csv')\n\nanomalies = []\ndrift_detected = False\nsummary_stats = {\"total_rows_train\": 0, \"total_rows_test\": 0, \"drifted_columns\": []}\n\n# TODO: Implement anomaly detection and drift comparison\n\n# --- FINAL OUTPUT --- (DO NOT MODIFY)\nprint(json.dumps({\"anomalies\": anomalies, \"drift_detected\": drift_detected, \"summary_stats\": summary_stats}))\n# -----------------------",
        "failure_cases": [
          "Hardcoded thresholds for one dataset",
          "No IQR implementation",
          "Absolute vs relative drift comparison",
          "Importing disallowed libraries"
        ],
        "hint_system": [
          {
            "unlock_after_attempts": 3,
            "hint": "IQR: Sort values. Q1 = value at index len/4, Q3 = value at index 3*len/4. IQR = Q3-Q1. Anomaly if value < Q1-1.5*IQR or > Q3+1.5*IQR."
          },
          {
            "unlock_after_attempts": 5,
            "hint": "Drift: compute median of each column for train and test. |(train_med - test_med) / train_med| > 0.2 means drift."
          },
          {
            "unlock_after_attempts": 8,
            "hint": "Median: sort values, pick middle value (or avg of two middle for even-length lists). Remember CSV values are strings \u2014 convert to float first."
          }
        ],
        "why_this_matters": "Anomaly detection and drift analysis are the FIRST things you should do with any dataset. Models on drifted/anomalous data fail silently in production.",
        "example_input": {
          "train.csv": "id,feature_a,feature_b,label\n1,10.2,100,0\n2,11.1,102,1\n3,9.8,98,0\n4,999.9,200,1",
          "test.csv": "id,feature_a,feature_b,label\n1,50.0,300,1\n2,51.2,305,1"
        },
        "guide_markdown": "# Statistical Anomaly Auditor (M1)\n\n## Overview\n\nData quality is the invisible foundation of Machine Learning. Before training any model, we must audit the data for **Anomalies** and **Drift**. \n\nIn this level, you will implement a statistical monitoring engine that identifies rows that deviate significantly from the norm using the Interquartile Range (IQR) method and detects median-based drift.\n\n---\n\n## Core Concepts\n\n*   **IQR (Interquartile Range)**: A robust measure of statistical dispersion.\n    *   **Q1**: The 25th percentile.\n    *   **Q3**: The 75th percentile.\n    *   **IQR**: `Q3 - Q1`.\n*   **Outlier Detection**: Any value outside the range `[Q1 - 1.5 * IQR, Q3 + 1.5 * IQR]` is flagged for review.\n*   **Metric Drift**: Monitoring how features change over time. If the median of the current batch differs from the baseline, your data may be \"drifting.\"\n\n---\n\n## Implementation Guide\n\nYour auditor should process the incoming data stream as follows:\n\n1.  **Calculate Baselines**: Compute the Q1, Median, and Q3 of the provided baseline dataset.\n2.  **Define Bounds**: Use the IQR formula to calculate the lower and upper bounds for each numeric feature.\n3.  **Audit the Current Batch**:\n    *   **Row-Level**: Flag every row where values fall outside the bounds.\n    *   **Feature-Level**: Calculate the new median of the current batch and compare it to the baseline.\n4.  **Reporting**: Construct a structured JSON report that summarizes these findings.\n\n---\n\n## \ud83d\udca1 Tip: Local Development\n\nStatistics are sensitive to edge cases (like lists with only 1 item).\n\n*   Test your code locally with a small list: `[1, 2, 3, 4, 100]`. \n*   Does your code correctly identify `100` as an outlier?\n*   What happens if all values are the same (`[10, 10, 10]`)? Your code should handle `IQR = 0` gracefully.\n",
        "evaluation_type": "multi_dataset",
        "has_training_dataset": false,
        "unlocked": true
      }
    ]
  },
  {
    "id": "genai",
    "name": "GenAI Track",
    "subtitle": "LLM Control Layer",
    "color": "#A855F7",
    "icon": "\ud83d\udfe3",
    "description": "Control LLM outputs \u2014 constrain, validate, enforce determinism.",
    "what_you_build": "A reliable LLM output control and enforcement system.",
    "what_you_learn": [
      "Prompt constraints",
      "Output enforcement",
      "Role restriction",
      "Self-healing prompts"
    ],
    "why_it_matters": "LLMs are powerful but unreliable. You'll learn to make them predictable.",
    "levels": [
      {
        "level_id": "G1",
        "track": "genai",
        "level_title": "JSON Extraction from Chaos",
        "resource_link": "https://python.langchain.com/docs/how_to/output_parser_json/",
        "resource_links": [
          {
            "title": "Clean JSON Extraction",
            "link": "https://python.langchain.com/docs/how_to/output_parser_json/"
          },
          {
            "title": "LLM Response Parsing",
            "link": "https://python.langchain.com/docs/concepts/output_parsers/"
          }
        ],
        "execution_mode": "code",
        "input_contract": {
          "type": "code",
          "language": "python",
          "description": "Extract JSON from multiple inconsistent LLM runs."
        },
        "output_contract": {
          "type": "json",
          "schema": {
            "best_parse": "dict",
            "runs": "list[str]",
            "consistency_score": "float"
          }
        },
        "goal": "Handle non-determinism by running extraction multiple times and selecting the most robust result.",
        "system_context": "Real LLMs are flakey. One run might be clean, the next wrapped in markdown, and the third prefixed with chatter. Your system must run the prompt 3 times and extract the best data.",
        "user_task": "Write a Python function `robust_extract(blurb)` that:\n1. Calls `simulate_llm(prompt)` exactly 3 times.\n2. In each run, extracts the JSON block (it might be wrapped in ```json or prefixed with text).\n3. Validates that the JSON contains 'name', 'age' (int), and 'city'.\n4. Selects the most 'complete' valid parse out of the 3 runs.\n5. Calculates a `consistency_score` (percentage of runs that yielded valid JSON).\nPrint JSON: {\"best_parse\": dict, \"runs\": [str], \"consistency_score\": float}",
        "protected_code": "# --- CHAOS ENGINE --- (DO NOT MODIFY THIS BLOCK)\ndef simulate_llm(prompt, mode=\"noisy\"):\n    import random\n    data = '{\"name\": \"Alice\", \"age\": 28, \"city\": \"Seattle\"}'\n    noise = [\"Sure! \", \"Here: \", \"```json\\n\" + data + \"\\n```\", \"Chatter... \" + data]\n    return random.choice(noise)\n# ------------------------------------------------\n\n# --- EXECUTION BLOCK --- (DO NOT MODIFY)\nwith open('blurb.txt') as f: blurb = f.read()\nprint(json.dumps(robust_extract(blurb)))\n# -----------------------",
        "initial_code": "import json, re\n\n# --- CHAOS ENGINE --- (DO NOT MODIFY THIS BLOCK)\ndef simulate_llm(prompt, mode=\"noisy\"):\n    import random\n    data = '{\"name\": \"Alice\", \"age\": 28, \"city\": \"Seattle\"}'\n    noise = [\"Sure! \", \"Here: \", \"```json\\n\" + data + \"\\n```\", \"Chatter... \" + data]\n    return random.choice(noise)\n# ------------------------------------------------\n\ndef robust_extract(blurb):\n    runs = []\n    # TODO: 1. Call simulate_llm(blurb) 3 times and store raw outputs\n    # TODO: 2. For each run, strip markdown backticks and extract JSON\n    # TODO: 3. Validate extracted JSON has 'name', 'age' (int), and 'city'\n    # TODO: 4. Select the best (most complete) valid parse\n    # TODO: 5. Calculate consistency_score = valid_runs / 3\n    return {\"best_parse\": {}, \"runs\": runs, \"consistency_score\": 0.0}\n\n# --- EXECUTION BLOCK --- (DO NOT MODIFY)\nwith open('blurb.txt') as f: blurb = f.read()\nprint(json.dumps(robust_extract(blurb)))\n# -----------------------",
        "failure_cases": [
          "Not handling markdown triple-backticks around the JSON block.",
          "Not performing multiple runs \u2014 single-shot extraction misses the consistency requirement.",
          "Not validating types (e.g., age must be int, not string '28')."
        ],
        "hint_system": [
          {
            "unlock_after_attempts": 3,
            "hint": "Use re.search(r'\\{.*?\\}', text, re.DOTALL) to extract the JSON block after stripping backtick fences."
          },
          {
            "unlock_after_attempts": 5,
            "hint": "consistency_score = number of runs where json.loads() succeeded and all 3 required fields were present, divided by 3."
          }
        ],
        "why_this_matters": "In production, single-run LLM calls are brittle. Multi-run voting or selection ensures your pipeline stays alive even when the model flinches.",
        "example_input": {
          "blurb.txt": "Alice is 28 years old and lives in Seattle."
        },
        "guide_markdown": "# System Prompt Engineer (G1)\n\n## Overview\n\nIn Generative AI, the **System Prompt** is the constitution of your agent. It defines the model's persona, its boundaries, and its core operational logic.\n\nIn this first GenAI challenge, you will move beyond simple chat and build a professional **Support Specialist**. You will learn how to \"pin\" a model's behavior so it remains helpful, concise, and focused on its domain.\n\n---\n\n## Core Concepts\n\n*   **Persona Definition**: Clearly telling the model *who* it is (e.g., \"You are a technical support engineer for a cloud platform\").\n*   **Safety Guardrails**: Hard-coding \"No-Go\" zones (e.g., \"Do not answer questions about pricing or competitors\").\n*   **Context Injection**: Providing the model with specific rules for the current session.\n*   **Output Constraint**: Forcing the model to respond in a specific tone or format.\n\n---\n\n## Implementation Guide\n\nYour code must construct a dynamic system prompt based on the provided configuration:\n\n1.  **Identity Construction**: Start with a strong persona statement.\n2.  **Rule Integration**: Loop through the `safety_rules` in the config and append them as negative constraints (\"Do not...\", \"Never...\").\n3.  **Instruction Merging**: Add specific `business_instructions` from the input data.\n4.  **Final Prompt Assembly**: Combine these into a single string to be sent as the `system` message in your LLM call.\n\n---\n\n## \ud83d\udca1 Tip: Local Development\n\nTesting LLM prompts is an iterative process.\n\n*   Copy your constructed prompt into ChatGPT or Claude locally.\n*   Try to \"trick\" it into breaking your rules (e.g., if you told it not to talk about pricing, ask it \"How much does the Pro plan cost?\").\n*   If it breaks, tighten the wording in your Python script and try again!\n",
        "evaluation_type": "multi_dataset",
        "has_training_dataset": false,
        "unlocked": true
      }
    ]
  },
  {
    "id": "agentic",
    "name": "Agentic Track",
    "subtitle": "Action Systems",
    "color": "#F97316",
    "icon": "\ud83d\udfe0",
    "description": "Build workflows that decide, act, and recover from failures.",
    "what_you_build": "An autonomous multi-step workflow engine.",
    "what_you_learn": [
      "Tool execution",
      "Sequential chaining",
      "Conditional routing",
      "Failure recovery"
    ],
    "why_it_matters": "The future of AI is agents that act, not just respond.",
    "levels": [
      {
        "level_id": "A1",
        "track": "agentic",
        "level_title": "Single Tool Execution",
        "resource_link": "https://platform.openai.com/docs/guides/function-calling",
        "resource_links": [
          {
            "title": "OpenAI Function Calling",
            "link": "https://platform.openai.com/docs/guides/function-calling"
          },
          {
            "title": "Tool Use Overview",
            "link": "https://www.anthropic.com/news/tool-use-ga"
          }
        ],
        "execution_mode": "code",
        "input_contract": {
          "type": "code",
          "language": "python",
          "description": "Write a basic tool execution mechanism."
        },
        "output_contract": {
          "type": "json",
          "schema": {
            "tool_called": "bool",
            "tool_args": "dict",
            "result": "str"
          }
        },
        "goal": "Build a parser that extracts a tool call request from text and executes a local Python function.",
        "system_context": "The foundation of agentic AI is tool use. Before building complex reasoning loops, you must be able to parse text like `Call read_weather({'city': 'Tokyo'})` and actually execute the Python function `read_weather`.",
        "user_task": "Write a Python script that parses the `llm_output.txt` file (which contains a simulated tool call string), extracts the function name and JSON arguments, calls the corresponding Python function defined in your code, and returns the result. Print JSON with tool_called, tool_args, and result.",
        "protected_code": "def read_weather(city):\n    weather = {\"Tokyo\": \"Rainy, 15C\", \"London\": \"Cloudy, 12C\", \"New York\": \"Sunny, 22C\"}\n    return weather.get(city, \"Unknown city\")\n\n# --- EXECUTION BLOCK --- (DO NOT MODIFY)\nwith open('llm_output.txt') as f: text = f.read()\nprint(json.dumps(execute_tool_from_text(text)))\n# -----------------------",
        "initial_code": "import json\nimport re\n\n# --- TOOLS --- (DO NOT MODIFY THIS BLOCK)\ndef read_weather(city):\n    weather = {\"Tokyo\": \"Rainy, 15C\", \"London\": \"Cloudy, 12C\", \"New York\": \"Sunny, 22C\"}\n    return weather.get(city, \"Unknown city\")\n# ----------------------------------------\n\ndef execute_tool_from_text(text):\n    # TODO: 1. Use regex to find the CALL: function(args) pattern\n    # TODO: 2. Extract function name and arguments (as JSON)\n    # TODO: 3. If function is read_weather, execute it with the extracted args\n\n    tool_called = False\n    tool_args = {}\n    result = \"\"  # Leave as empty string when no tool is called\n\n    return {\"tool_called\": tool_called, \"tool_args\": tool_args, \"result\": result}\n\n# --- EXECUTION BLOCK --- (DO NOT MODIFY)\nwith open('llm_output.txt') as f: text = f.read()\nprint(json.dumps(execute_tool_from_text(text)))\n# -----------------------",
        "failure_cases": [
          "Regex too strict to catch prefix/suffix text.",
          "json.loads failing due to unescaped quotes."
        ],
        "hint_system": [
          {
            "unlock_after_attempts": 3,
            "hint": "Use re.search(r'CALL:\\s*(\\w+)\\((.+)\\)', text) to capture function name and args separately."
          }
        ],
        "why_this_matters": "Agents are just text parsers that run code. Mastering this parser is step 1.",
        "example_input": {
          "llm_output.txt": "I will check now. CALL: read_weather({\"city\": \"London\"}) Thanks."
        },
        "guide_markdown": "# Deterministic Tool Executor (A1)\n\n## Overview\n\nTraditional software is predictable, but **Agents** are dynamic. The bridge between an LLM's imagination and the real world is the **Tool**.\n\nIn this challenge, you will implement a secure \"Tool Executor\"\u2014a system that receives a string request from an LLM, parses its intent, and executes the correct Python function with the specified parameters.\n\n---\n\n## Core Concepts\n\n*   **Function Mapping**: Creating a registry that maps string names (like `\"get_weather\"`) to actual Python functions.\n*   **Argument Parsing**: Safely extracting parameters from the LLM's response (often provided as JSON).\n*   **Safety Sandboxing**: Ensuring the agent can only call allowed functions and cannot run arbitrary code (like `os.system`).\n*   **Result Feedback**: Converting the function output back into a format the LLM can understand for its next step.\n\n---\n\n## Implementation Guide\n\nTo build a reliable executor, your code should:\n\n1.  **Define your Tools**: Create a dictionary of functions that the agent is allowed to use.\n2.  **Parse the Request**: \n    *   Look at the `tool_call` object in the input. \n    *   Extract the `function_name` and the `arguments`.\n3.  **Execute with Key-Splatting**: Call the matching function using the `**args` operator to pass parameters dynamically.\n4.  **Handle Errors**: If the agent asks for a function that doesn't exist, return a clear error message instead of crashing.\n\n---\n\n## \ud83d\udca1 Tip: Local Development\n\nThis is the most common pattern in modern AI engineering (Function Calling).\n\n*   Try adding a simple `add(a, b)` function to your local tool dictionary.\n*   Pass a \"Fake\" LLM response like `{\"name\": \"add\", \"args\": {\"a\": 5, \"b\": 10}}` to your executor.\n*   Verify it returns `15`. \n*   This \"Mock\" testing will help you ensure your dictionary mapping is perfect before you submit.\n",
        "evaluation_type": "multi_dataset",
        "has_training_dataset": false,
        "unlocked": true
      }
    ]
  },
  {
    "id": "deployment",
    "name": "Deployment Track",
    "subtitle": "Serving Layer",
    "color": "#EF4444",
    "icon": "\ud83d\udd34",
    "description": "Serve models via APIs with validation, state, and stability.",
    "what_you_build": "A production API serving layer for ML models.",
    "what_you_learn": [
      "API contracts",
      "Input validation",
      "Stateful processing",
      "Production stability"
    ],
    "why_it_matters": "AI that can't be deployed reliably is AI that doesn't exist.",
    "levels": [
      {
        "level_id": "D1",
        "track": "deployment",
        "level_title": "Request Validation Engine",
        "resource_link": "https://docs.pydantic.dev/latest/concepts/models/",
        "resource_links": [
          {
            "title": "Pydantic Models",
            "link": "https://docs.pydantic.dev/latest/concepts/models/"
          },
          {
            "title": "Data Validation Patterns",
            "link": "https://docs.pydantic.dev/latest/concepts/validators/"
          }
        ],
        "execution_mode": "code",
        "input_contract": {
          "type": "code",
          "language": "python",
          "description": "Write a request validation engine using Pydantic."
        },
        "output_contract": {
          "type": "json",
          "schema": {
            "status": "str",
            "results": "list[dict]"
          }
        },
        "goal": "Build a robust request validator using Pydantic for strict schema enforcement \u2014 the same validation layer used in production FastAPI services.",
        "system_context": "Before any ML model sees data, requests must be validated. In production, Pydantic is the standard for enforcing schemas \u2014 it rejects malformed data with clear errors before it ever reaches your model.",
        "user_task": "Write a Python script that:\n1. Reads 'requests.json'.\n2. Defines a PredictionInput Pydantic model with: 'age' (int, 0-120), 'income' (float > 0), and 'status' (either 'active' or 'inactive').\n3. Validates each request payload in requests.\n4. Prints JSON: {\"status\": \"completed\", \"results\": [{\"payload_valid\": bool}]}",
        "protected_code": "# --- DATA LOADING --- (DO NOT MODIFY)\nwith open('requests.json') as f: requests_data = json.load(f)\n# ------------------------------------\n\n# --- FINAL OUTPUT --- (DO NOT MODIFY)\nprint(json.dumps({\"status\": \"completed\", \"results\": results}))\n# --------------------",
        "initial_code": "import json\nfrom pydantic import BaseModel, conint, confloat\nfrom typing import Literal\n\nclass PredictionInput(BaseModel):\n    # TODO: Define Pydantic fields with constraints\n    # age: conint(ge=0, le=120)\n    # income: confloat(gt=0)\n    # status: Literal['active', 'inactive']\n    pass\n\ndef handle_request(raw_json):\n    # TODO: Validate raw_json using PredictionInput\n    # Return {\"payload_valid\": True} on success, {\"payload_valid\": False} on ValidationError\n    return {\"payload_valid\": False}\n\n# --- DATA LOADING --- (DO NOT MODIFY)\nwith open('requests.json') as f: requests_data = json.load(f)\n# ------------------------------------\n\nresults = []\n# TODO: Loop through requests_data and call handle_request for each\n\n# --- FINAL OUTPUT --- (DO NOT MODIFY)\nprint(json.dumps({\"status\": \"completed\", \"results\": results}))\n# --------------------",
        "failure_cases": [
          "Not using Pydantic constraints \u2014 manual if/else checks that miss edge cases.",
          "Allowing negative income or ages above 120 due to missing field constraints.",
          "Not catching pydantic.ValidationError \u2014 letting exceptions propagate instead of returning payload_valid: False."
        ],
        "hint_system": [
          {
            "unlock_after_attempts": 3,
            "hint": "Import ValidationError from pydantic and wrap PredictionInput(**raw_json) in a try/except block to catch invalid payloads gracefully."
          },
          {
            "unlock_after_attempts": 5,
            "hint": "Use Literal['active', 'inactive'] from the typing module for the status field \u2014 Pydantic will reject any other string value automatically."
          }
        ],
        "why_this_matters": "Pydantic validation is the industry standard for Python APIs. It ensures your model never sees corrupted data \u2014 this is the same pattern used in every FastAPI service.",
        "example_input": {
          "requests.json": "[\n  {\"age\": 25, \"income\": 50000.0, \"status\": \"active\"},\n  {\"age\": 150, \"income\": -10.0, \"status\": \"unknown\"}\n]"
        },
        "guide_markdown": "# Request Validation Engine (D1)\n\n## Overview\nDeployment is about exposing your code to the world. The first line of defense is **Input Validation**. This level teaches you how to use **Pydantic** to reject malformed requests before they hit your business logic.\n\n## Core Concepts\n1. **BaseModel**: The foundation of Pydantic. Use it to define your API's input schema.\n2. **Type Coercion**: Pydantic automatically converts strings like `\"123\"` to `int` if that's the type you defined.\n3. **ValidationError**: Use try-except blocks to catch invalid data and return a clean failure.\n\n## Implementation Guide\n- Define a class inheriting from `pydantic.BaseModel`.\n- For the `predict` function, take the raw dictionary, try to instantiate your model with it.\n- If it fails, capture the error.\n\n## \ud83d\udca1 Tip\nDon't write raw if-else checks for every field. Let Pydantic do the heavy lifting!\n",
        "evaluation_type": "multi_dataset",
        "has_training_dataset": false,
        "unlocked": true
      }
    ]
  }
];
