[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-7f7980b617ed060a017424585567c406b6ee15c891e84e1186181d67ecf80aa0.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=13376841)

# React to Riches

## Project Credit:
This is my final project for Winter 2024 MSCI 342: Principles of Software Engineering completed in collaboration with Liam Mitchell and Mehul Dewit

## Project Features:

### Sign-up/Sign-in

- On opening the web app, you will be greeted by a sign-in prompt.
  - Enter a matching email and password, then click "Submit" to sign-in.
  - Otherwise, click "Create Account" to make a new account instead.
- To create a new account, fill in the requested account details. Photo URL is
  optional.
  - Click "Submit" to create the account. This will bring you back to the
    sign-in page, where you can use the new credentials.
- After signing-in, click the "Sign-out" button on the homepage to switch to a
  different account.

### Blog Feature

- View all blog posts stored on the server by clicking the "Social" and then "Blog" buttons in the navigation bar.
  - A table will be rendered, showing all posts including their title, author, first 200 characters of the text body, and tags.
- Click "Write new post" to open the editor and write a new blog post.
  - A title and text body are both required, but tags are optional.
  - The tags can be added by clicking their respective chip buttons.
  - Clicking "Submit" will add your post to the server.
- Click on any of the posts in the table to open its full details.
  - This will include a list of reactions (emoticons) that can be clicked to add your own reaction to the post.
  - The total number of reactions (distinct users who have clicked the button) is counted and displayed.
  - A list of all comments will also be rendered at the bottom of the page.
  - You may add new comments to the post by clicking the "Add comment" button, writing some text, and clicking "Submit".
- Click "View your posts" to see only the posts that you have written.
  - Clicking on any of these posts will open its full details, except you will also notice a button at the top called "Edit post"
- Clicking "Edit post" opens the editor window with the post's title, body, and tags autofilled, and allows the original author to make adjustments as needed.
  - There is also the option to delete the post outright if needed.
 
### Budget Features
- Landing page shows pie charts comparing budgeted spending by category and actual spending by category.
- Categories are needs, wants and savings. Sub-categories are custom by users.
- Add transactions & savings page allows users to input expenses and savings, providing category/towards, amount, and date.
- Set budget limits page allows users to set their spending limits by category.
- View transactions & savings page allows users to view and delete all transactions and savings as needed.
- View Categories page allows users to view current categories, delete categories and add new categories.

### Financial Goals Features
- Landing page shows current financial goals with their titles, descriptions, target amount, target date and status
- Options for the user to delete goals and edit their status (status is still to be connected to savings)

### Food Services
- View the food services page by clicking the account dropdown menu and then the "Food Services" button.
- For new accounts to this feature (or Important Dates), you will need to register your email with UWaterloo's OpenAPI:
  - Click the "Register Email" button
    - An email will be sent after a minute or so to the account's email address with an activation code
  - Paste the activation code into the text box and click "Submit"
    - Another email will be sent, this one confirming the activation and providing the API key
  - Paste the API key into the textbox and click "Submit"
    - The email address is now activated and an API key is associated with the account
- There are two buttons with options to either "View Outlets" (dining locations like cafeterias) or "View Franchises" (specific eateries like Subway or Tim Horton's)
  - Clicking either button will load all data points for the respective type
  - Clicking on an individual outlet or franchise will render all available information about it
    - For outlets, this includes the photo in a larger size as well as the title and summary
    - For franchises, the menu is rendered with photos of menu items

### Important Dates
- View the important dates page by clicking the account dropdown menu and then the "Important Dates" button.
- For new accounts to this feature (or Food Services), you will need to register your email with UWaterloo's OpenAPI:
  - Click the "Register Email" button
    - An email will be sent after a minute or so to the account's email address with an activation code
  - Paste the activation code into the text box and click "Submit"
    - Another email will be sent, this one confirming the activation and providing the API key
  - Paste the API key into the textbox and click "Submit"
    - The email address is now activated and an API key is associated with the account
- Click the "View Important Dates" button to load and render all dates
  - Date titles, applicable calendar days, and type will be rendered in the table
  - Clicking on a specific date will show its HTML description in a pop-up dialog box

### Notifications

- View notifications and settings stored on the server by clicking the bell icon button in the navigation bar.
- Click the "Request notification access" button to trigger a desktop notification prompt from the browser (Chrome or Firefox, Safari doesn't work)
  - Accept the prompt to allow the web app to send notifications from the browser
- Use the multiselect buttons to pick which types of notifications you want to recieve.
  - Click "Save" to send preferences to the server, and render those notification types.
- A table will be rendered, showing all notifications including their time, type, and message.
  - If desktop notifications are enabled, they will also be triggered for the new notifications.
- So long as this notification page is open, the system will check for new notifications every ten seconds.
  - New notifications (from within those ten seconds) will trigger new desktop alerts.

### Videos

- View all videos stored on the server by clicking the "Social" then "Videos" buttons in the navigation bar.
  - A table will be rendered, showing all videos including their title, iframe, and who posted it.
- Click "Post a new video" to share a video on the platform.
  - A title is required, either typed or pasted.
  - A YouTube video URL is required
- You can watch videos by clicking the iframe in the table view, using the native controls provided by the original platform.

### Watchlist
- Allows users to manage and view their favourite stocks. It includes a form to input stock names and a button to add them to the watchlist. 
- The entered stocks are displayed below the form, providing users with a quick overview of their personalized stock watchlist.

### Stocks
- Designed for fetching and displaying real-time stock prices. It incorporates a user interface where users can enter a stock ticker symbol and choose a timeframe for which they want to view the stock prices. 
- The component is using Alpha Vantage's API
- The component interacts with a server through API calls to fetch the stock data. Additionally, it provides error handling to inform users about potential issues, such as the API rate limit being exceeded.
- The limitation is that there are only 25 calls/day; this was the most for a free API with the needed functionality. The connection is routed correctly to Alpha Vantage's endpoint, as seen through the console log when used, but there is a chance that the limit will get exceeded.

### Community
- Users can create new communities, join existing ones, and interact with other members. 
- Upon accessing the Community section, users are presented with options to create a new community, view all existing communities, add new friends, and see a list of all friends. 

### Messaging
- Enables users to communicate with their friends within the application
- Users can select friends from their contacts, compose messages, and send them seamlessly
- Upon sending a message, users can view the messages they send, including the recipient's name, message content, and sent time. 

### Credit Score
- Allows users to input multiple data fields to get a rough credit score
- Pop-up "more info" button gives the users more information about how their credit score is calculated
- The calculated credit score is displayed to the user, along with additional inputted insights and information







