1. Logout (Delete sessions) -- Done
2. PATCH user
3. Create Game              -- Done
4. Edit Game
5. Get Game                 -- Done
6. Delete Game
7. Create Question          -- Done
8. Edit Question
9. Delete Question
10. Create Answer           -- Done
11. Edit Answer
12. Delete Answer
13. Create Room 
14. Xstate game machine


XState game machine notes - 
  1. The machine should be created during POST /games/:gameId/rooms. 
    - Thats the point where the game information (questions/answers) should be loaded and put in to a format suitable for the game
    - It should be `start()`ed and ready to accept an owner
  2. The first websocket connection should be able to inspect the ticket and forward the event on to the machine and that is how it bootstraps.