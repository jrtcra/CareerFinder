Names: Kelly Lin, Kaiyao Ke, Jarrett Cura, Victor Zhao

## Changes in Direction of Project

The original proposal had a broad focus on career exploration as a whole, including both job and career matching based on user skills, interests, and values. However, as the project progressed, we narrowed the scope to focus mainly on individual job matching using user-provided skills. This shift allowed us to focus our development efforts and deliver a more focused, functional application. By targeting specific job postings rather than long-term career paths, we could ensure more precise recommendations while efficiently utilizing our available data and resources. This change enabled us to integrate features like job summaries that include salary ranges, job descriptions, and outlooks, providing users with comprehensive insights into each matched role.

## What the Application Achieved or Failed

Our application successfully provides the user personalized job matches based on the skills inputted by the user. The matching system uses real-world job postings sourced from Indeed and displays relevant recommendations tailored to each user's profile. Also, the application offers a brief summary of each recommended job, including salary ranges, job descriptions, and employment outlooks, which adds value by providing insights for decision-making. Advanced database features, such as triggers for data consistency and stored procedures for flexible job searching, were implemented to enhance backend efficiency. 
However, our application lacks a creative component such as NLP for skill extraction or job recommendations. This limited the user experience to manually entered inputs, and advanced matching algorithms that analyze broader aspects of user data weren't implemented due to time constraints. 

## Changes in Schema or Data Source

Initially, we planned to utilize data from the Occupational Outlook Handbook to provide detailed career insights. However, during development, we shifted to relying solely on Indeed data, which provided up-to-date and sufficient job postings to meet the application's matching requirements. This change simplified the data gathering process and allowed us to focus on implementing functionalities without introducing additional layers of complexity. Indeed's job postings already included essential details such as salary, job descriptions, and required skills, which matched up with our project goals. The choice of a single data source also simplified our database design and queries, resulting in a more efficient backend.

## Changes to ER diagram and Table Implementations

No significant changes were made to the original ER diagram or table designs. The initial schema was robust enough to support the application's functionality. We added some attributes to each table that wasn’t specified in the table designs, such as skill usage, in order to complete some of the functionality of the application.

## Functionalities Added or Removed

Several functionalities were adjusted to align with project constraints and priorities. While features like NLP-based skill extraction and quiz-style account creation were initially planned, they were removed due to their complexity and the lack of a complete NLP integration. Instead, the focus shifted to manual skill input, which still allowed effective job matching and simplified user interaction. Additional features, such as bookmarking jobs for future reference, were also removed to simplify the user interface and backend operations. Despite these removals, the application provides job summaries—covering salary ranges, job descriptions, and outlooks—that add important value to the job-matching functionality. This tradeoff ensured we delivered a functional and user-friendly application within the project's timeframe.

## Advanced Database Programs

We implemented the following advanced database features in our application: 
Trigger: Added data cleaning when updating job postings to ensure salary information is stored in a consistent format.
Stored procedure: Allows flexible job searching based on user input, such as keywords, location, or salary.
Constraint: Ensures nullity checks for username and password during user sign-up. 
Transaction: Supports fetching job postings that match user skills and displays common skills for high-salary jobs.

## Technical Challenges

Google cloud vs docker
Data loading from csv into database
Database design/schema
Setting up html with typescript 

- Jarett – We had some trouble finding the right functionality to implement an SQL trigger. Most of our functionality was better off being completed in real-time, which is difficult to achieve with SQL rather than within the typescript itself. 
- Victor – I thought deciding where we were going to deploy and test our code was difficult. We ultimately decided to use docker because it is easier to work on the same project together that way, however we did spend some time trying to configure Google Cloud and missed out on being able to deploy the application on the web.
- Kaiyao – We need to preprocess the dataset because the original CSV files contain some non-informative columns, and certain rows have incomplete or missing data in key columns. To clean the dataset, we will remove unnecessary attributes and filter out incomplete tuples.
- Kelly – I thought that setting up the HTML frontend with TypeScript integration caused some challenges in linking the frontend components to the backend API. Properly configuring the TypeScript environment required additional research and debugging. 
Some advice for future teams would be to carefully evaluate deployment options early in the planning process in order to avoid delays later in the development/deployment process. Also, when handling CSV data to always perform preprocessing before importing it into the database to minimize errors. Moreover, remember to break down frontend and backend tasks into small, testable components to simplify integration.

## Other Changes from Proposal

Several other changes were made during the development process to deliver a functional and simplified application. For example, we removed the ability to save or bookmark jobs in order to prioritize the job matching functionality. We also removed the planned quiz-style account creation feature because connecting quiz responses to skill inputs without an NLP model proved too challenging within the project timeline. Moreover, the aesthetic components, such as CSS styling, was not our team’s main focus. We decided to focus on backend efficiency and feature completion. However, our application successfully integrates job summaries, which provides the user with salary ranges, job details, and employment outlooks. This information offers users meaningful information alongside personalized job recommendations.

## Potential Improvements

Some potential improvements we could consider for the future include enhancing our application’s security. For instance, we could strengthen user data privacy by implementing more robust encryption methods and introducing multi-factor authentication. Additionally, as our user profile database grows, optimizing the application’s performance will become increasingly important. To handle higher traffic efficiently, we could explore techniques like caching and data compression to maintain smooth performance under heavy load. We also believe it would be beneficial to incorporate assistive technologies to make the web application more accessible. Features like voice commands and screen reader compatibility could ensure a more inclusive experience for users with disabilities.

## Final Division of Labor

As a group, we will all focus on similar areas of application development at the same time but split our team into different subgroups as necessary. This is so we can follow the stages of the CS 411 assignments, specifically the backend requirements so we can finish those as soon as possible. We also want to follow similar workflows throughout the project, so no one is constantly switching priorities (for example, someone setting up the database management system will be setting up security aspects, hence also doing authentication later on in the assignment).

Backend Development:
Database Management - JC, KL
Data Preprocessing - KK, VZ
API development - KL, VZ

Frontend Development:
Frontend development - JC, KL

Logistical/Maintenance:
Authentication - JC, KK
Deployment - KL, VZ
Testing - JC, KK, VZ, KL

The division of labor in our team was fair and well-balanced. Each member took responsibility for different tasks based on their strengths, which allowed us to utilize everyone's expertise. We made sure that workloads were distributed evenly, and everyone had the opportunity to contribute to the project in a meaningful way. 

Our team worked well together throughout the process. We maintained open communication, and we regularly met up for meetings to discuss progress and address any challenges. This collaboration ensured that we stayed on track and could quickly resolve any issues that arose. Overall, I believe our teamwork was effective, and it helped us achieve our goals efficiently.
