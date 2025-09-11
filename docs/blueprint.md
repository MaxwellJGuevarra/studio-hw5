# **App Name**: VulnProbe

## Core Features:

- STDIO Vulnerable Server: A server that exposes vulnerabilities through a standard input/output (STDIO) transport, including SQL injection, file system access, and command execution.
- SSE Vulnerable Server with Attack Endpoint: A server that uses Server-Sent Events (SSE) for transport and includes a dedicated /attack endpoint to simulate and demonstrate various attack scenarios.
- Comprehensive Attack Client: Automates attacks against the STDIO and SSE servers and provides a report with success metrics for different vulnerability types.
- SQL Injection Tests: Executes various SQL injection payloads against the vulnerable servers to demonstrate database manipulation and data leakage.
- File Access Tests: Attempts to read sensitive files on the server using path traversal techniques.
- Command Execution Tests: Injects OS commands into the application to execute arbitrary code on the server.
- Comprehensive Attack Report Generator: Summarize attack success metrics and provides actionable insights, based on structured results.

## Style Guidelines:

- Primary color: Dark Blue (#34495E) to convey seriousness and technical focus.
- Background color: Very dark gray (#2C3E50) to create a dark theme that is easy on the eyes.
- Accent color: Orange (#E67E22) to highlight critical information and action items.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern look. Note: currently only Google Fonts are supported.
- Use a set of consistent and clear icons, using a monospace style to enhance readability.
- Use a structured layout with clear sections for each type of vulnerability and its corresponding test results.
- Subtle animations on the attack report will indicate successes, failures, and ongoing tests.