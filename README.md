## Song of the Week

[ to add description here]

## To - Do

* Add logo and name for browser window

## Running in Dev

`npm run dev`

## Tech Stack

NextJS Front End

Vercel Serverless Functions Backend (api routes)

Supabase database

-- login is tied to zachwalravens github

## Database Structure

groups (
    group_id TEXT
    is_finished BOOL
)

group_members (
    group_id VARCHAR
    user_name VARCHAR
    is_owner BOOL
)

songs (
    group_id VARCHAR
    submitting_user VARCHAR
    song_url VARCHAR
)

votes (
    group_id
    voting_user
    song_url
)