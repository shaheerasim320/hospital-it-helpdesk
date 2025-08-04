
# Hospital IT Help Desk

A web-based platform for managing internal IT support requests in hospitals, built with **Next.js**, **Firebase**, **Firestore**, and **Zustand**.

🔗 **Live Site:** [https://hospital-it-helpdesk.vercel.app/](https://hospital-it-helpdesk.vercel.app/)

---

## 🔧 Features

- **Role-Based Access Control**
  - Admins, IT Support, and Staff roles
  - New users must be approved by admin before accessing the dashboard

- **Authentication**
  - Firebase Auth (Email/Password)
  - Zustand store for persistent auth state
  - Approval-based access logic handled at login

- **Ticket Management**
  - Staff can raise new IT support tickets
  - Admins/IT Staff can view, assign, resolve, or reject tickets
  - Ticket history view with real-time status updates

- **Email Notifications**
  - **Powered by Brevo (formerly Sendinblue)**:
    - On user registration (pending approval)
    - When admin approves/revokes access
    - When a ticket is created, updated, or resolved

- **User Profile Management**
  - Admins can approve/revoke access
  - Staff can manage their profile


---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| **Next.js (App Router)** | Frontend and server actions |
| **Firebase Auth**        | Authentication system       |
| **Firestore**            | Real-time database          |
| **Zustand**              | Global state management     |
| **Brevo SMTP**           | Email sending service       |


---

## 🚀 Future Improvements

- Ticket categories and priorities
- Ticket analytics dashboard
- File upload for attachments
- Notifications center (in-app)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.


