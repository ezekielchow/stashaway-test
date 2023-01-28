# stashaway-test 

## Project information
- [Github](https://github.com/ezekielchow/stashaway-test)
- [Replit](https://replit.com/join/yjvmybixnz-ezekielchow)
- [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/8535914-027701b8-dceb-49fb-9a8a-e8fb70f46371?action=collection%2Ffork&collection-url=entityId%3D8535914-027701b8-dceb-49fb-9a8a-e8fb70f46371%26entityType%3Dcollection%26workspaceId%3D412e38fc-8517-4e35-892d-be89d7950ad0#?env%5BCloud%5D=W3sia2V5IjoiYmFzZVVybCIsInZhbHVlIjoiaHR0cHM6Ly9zdGFzaGF3YXktdGVzdC5lemVraWVsY2hvdy5yZXBsLmNvIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJodHRwczovL3N0YXNoYXdheS10ZXN0LmV6ZWtpZWxjaG93LnJlcGwuY28iLCJzZXNzaW9uSW5kZXgiOjB9XQ==)

## How to use
1. Copy .env.sample to .env
2. Fill in missing environment variables in .env
3. Run `$ docker-compose up`
4. Mongo express can be accessed by http://localhost:8081
5. Access to endpoints at http://localhost:{APP_PORT}

## Testing allocation of funds using Postman
### More info
- Use the get requests to assist in getting the _ids
- Fill in the Params & Body of the request with the information required by the requests

### Steps
1. Create a user [here](https://www.postman.com/bold-zodiac-964898/workspace/412e38fc-8517-4e35-892d-be89d7950ad0/request/8535914-804caf01-7dc7-4f78-b4b0-cb948c28b22d)
2. Create the portfolios [here](https://www.postman.com/bold-zodiac-964898/workspace/412e38fc-8517-4e35-892d-be89d7950ad0/request/8535914-1a796eea-251c-4576-9720-0d25f33eb390)
3. Create a user deposit [here](https://www.postman.com/bold-zodiac-964898/workspace/412e38fc-8517-4e35-892d-be89d7950ad0/request/8535914-2d7a4187-be0d-4d63-ae53-6a21bc505d31)
4. You can recheck the old allocations [here](https://www.postman.com/bold-zodiac-964898/workspace/412e38fc-8517-4e35-892d-be89d7950ad0/request/8535914-6dbb52c6-7ab8-416d-a8f2-9c4070da5f9c)

## Thought process
- I started by designing the database to fit in the information given from the example
- I seeded some data into the schemas created so it helps with visualizing how the allocation of funds should work
- Then, I coded to handle the example scenario given alongside a test
- More code & tests was added to handle scenarios that I found unhandled

## What can be improved
- Use database transaction to handle multiple database operations (Tried to use mongoose|mongodb db transaction with replicasets but couldn't make it work)
- Refactoring of some duplication of code in user-deposit-service.js & improve readerbility so handled scenarios can be seen clearly
- Use Typescript for files that aren't using it
- Add linting for Typescript files
