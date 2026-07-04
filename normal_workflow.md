# Normal Workflow

1. corriger le code
2. modify package.json as 1.x.y
3. yarn bfc
4. add ., commit -m "message", git push
5. git tag v1.x.y
6. git push origin v1.x.y

After:

7. yarn deploy:cdn "message"