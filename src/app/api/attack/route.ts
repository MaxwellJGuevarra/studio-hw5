
import {NextRequest, NextResponse} from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as os from 'os';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import crypto from 'crypto';

// Initialize the database
async function getDb() {
  const db = await open({
    filename: '/tmp/vulnprobe.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL
    );
  `);
  // Add some dummy data if table is empty
    const count = await db.get('SELECT COUNT(*) as count FROM records');
    if (count.count === 0) {
        await db.run("INSERT INTO records (name, address) VALUES (?, ?)", "John Doe", "123 Main St");
        await db.run("INSERT INTO records (name, address) VALUES (?, ?)", "Jane Smith", "456 Oak Ave");
    }

  return db;
}


export async function POST(req: NextRequest) {
  try {
    const { tool, params } = await req.json();

    let result: any;

    switch (tool) {
      // SQL Injection
      case 'insert_record': {
        const { name, address } = params;
        const db = await getDb();
        // VULNERABLE: Direct string interpolation
        const query = `INSERT INTO records (name, address) VALUES ('${name}', '${address}')`;
        await db.exec(query);
        result = `Record inserted: ${name}, ${address}`;
        break;
      }
      case 'execute_sql': {
        const { query } = params;
        const db = await getDb();
        // VULNERABLE: Executes arbitrary SQL query
        result = await db.all(query);
        break;
      }

      // Env Var Exposure
      case 'get_env_variable': {
        const { var_name } = params;
        // VULNERABLE: Reads any environment variable
        result = process.env[var_name] || "Variable not found";
        break;
      }

      // File System
      case 'read_file': {
        const { file_path } = params;
        // VULNERABLE: Path Traversal
        const safePath = path.join('/tmp/', file_path); // Attempt to sandbox, but can be bypassed
        try {
            result = await fs.readFile(safePath, 'utf-8');
        } catch (e: any) {
            result = `Error reading file: ${e.message}`;
        }
        break;
      }

      // Command Execution
      case 'execute_command': {
        const { command } = params;
        // VULNERABLE: Arbitrary Command Execution
        result = await new Promise((resolve) => {
          exec(command, (error, stdout, stderr) => {
            resolve(`Output: ${stdout}\nError: ${stderr}`);
          });
        });
        break;
      }
      
      // Network (SSRF)
      case 'make_request': {
          const { url } = params;
          try {
            const response = await fetch(url);
            const text = await response.text();
            result = `Status: ${response.status}\nContent: ${text.substring(0, 500)}`;
          } catch (e: any) {
            result = `Error making request: ${e.message}`;
          }
          break;
      }

      // Crypto
      case 'generate_hash': {
          const { data, algorithm = 'md5' } = params;
          try {
            // VULNERABLE: Allows weak hashing algorithms like md5, sha1
            const hasher = crypto.createHash(algorithm);
            hasher.update(data);
            result = hasher.digest('hex');
          } catch (e: any) {
              result = `Error generating hash: ${e.message}. Invalid algorithm.`
          }
          break;
      }

      default:
        return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json({ result });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
