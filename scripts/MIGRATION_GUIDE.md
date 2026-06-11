# Migration Scripts Reference

One-time use scripts for migrating existing data to field-level i18n structure.

## Available Scripts

### 1. migrate-workshops.mjs

Converts workshop documents from flat structure to field-level arrays.

**What it does:**
- Finds all workshops with English content
- Wraps title, slug, description, and body in language arrays
- Generates unique _key identifiers for array items
- Skips workshops already migrated

**Usage:**
```bash
SANITY_AUTH_TOKEN=your_token node scripts/migrate-workshops.mjs
```

**Environment Variables:**
- `SANITY_AUTH_TOKEN` - Your Sanity API token with Editor permissions
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - (auto-loaded from src/sanity/env.ts)
- `NEXT_PUBLIC_SANITY_DATASET` - (auto-loaded from src/sanity/env.ts)

**Example Output:**
```
Starting workshop migration...
Found 22 workshops to migrate
✓ Migrated: Beginner 1 - The Sewing Machine and Your First Stitches
✓ Migrated: Altering Blazers - Make Your Blazer Actually Fit
⊘ Skipping xyz123 (already migrated)
Migration complete!
✓ Successfully migrated: 20
✗ Errors: 0
```

### 2. fix-workshops.mjs

Fixes double-wrapped fields from migration errors.

**What it does:**
- Detects fields that were wrapped twice (e.g., `title[0].value` is an array instead of string)
- Unwraps them to the correct structure
- Regenerates _key identifiers

**Usage:**
```bash
SANITY_AUTH_TOKEN=your_token node scripts/fix-workshops.mjs
```

**When to use:**
- After a failed migration
- If workshops show "[object Object]" in Studio
- If fields appear empty despite having content

### 3. fix-slugs.mjs

Ensures all slug values are proper Sanity slug objects.

**What it does:**
- Checks for slugs stored as strings instead of objects
- Wraps string slugs in `{ current: "slug-value" }` format
- Generates slugs from titles if missing

**Usage:**
```bash
SANITY_AUTH_TOKEN=your_token node scripts/fix-slugs.mjs
```

**When to use:**
- If you see "Invalid property value" errors in Sanity Studio for slug fields
- If slug values show as empty strings

## Getting Your Auth Token

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Navigate to **Settings → API → Tokens**
4. Create a new token with:
   - Name: "Migration Token" (or descriptive name)
   - Permissions: **Editor**
5. Copy the token
6. Keep it secure - treat it like a password

## Running Scripts in Production

If you need to run these in a production environment:

```bash
# Export token
export SANITY_AUTH_TOKEN="your_prod_token"

# Run migration
node scripts/migrate-workshops.mjs

# Verify results in Sanity Studio
# Then commit any changes
```

## Troubleshooting

### "Missing required environment variables"
Make sure you're setting `SANITY_AUTH_TOKEN`:
```bash
# ✅ Correct
SANITY_AUTH_TOKEN=token_here node scripts/migrate-workshops.mjs

# ❌ Wrong
node scripts/migrate-workshops.mjs
```

### "Error: EACCES: permission denied"
Check file permissions:
```bash
chmod +x scripts/migrate-workshops.mjs
```

### "Error: Cannot find module '@sanity/client'"
Install dependencies:
```bash
npm install
```

### Script hangs or seems stuck
- Check your internet connection
- Verify the auth token is valid
- Check if Sanity API is online (sanity.io/status)
- Try again in a few minutes

## After Running Scripts

1. **Verify in Sanity Studio:**
   - Open a workshop
   - Check that all fields have English and Danish tabs
   - Verify content is displayed correctly

2. **Test on website:**
   - Visit `/en/workshops`
   - Visit `/da/workshops`
   - Verify all workshops appear with correct content

3. **Commit the results:**
   ```bash
   git add .
   git commit -m "migrate: apply field-level i18n migration"
   git push
   ```

## Notes

- These scripts are **idempotent** - running them multiple times is safe
- They **skip already-migrated documents** to avoid duplication
- All changes are made in Sanity, not in code
- No manual data backups needed (Sanity has version history)
