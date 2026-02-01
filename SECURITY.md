# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email: [your-email@example.com] with details
3. Include steps to reproduce
4. We'll respond within 48 hours

## Security Measures

- All authentication handled by Supabase (industry-standard security)
- Row Level Security (RLS) protects user data
- No passwords stored in our code
- HTTPS-only in production
- Client-side only - no backend to compromise

## Data Privacy

- Camera/microphone only processed locally
- Speech recognition uses Web Speech API (Google services)
- User data stored in Supabase with RLS
- No third-party tracking or analytics
- Users can delete their accounts and all associated data

## Best Practices

- Never share your Supabase credentials
- Use strong, unique passwords
- Regularly update dependencies
- Report suspicious activity
