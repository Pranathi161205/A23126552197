import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const NOTIFICATION_API =
  "http://4.224.186.213/evaluation-service/notifications";

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function calculateScore(notification) {
  const typeWeight = weights[notification.Type] || 0;

  const age =
    (Date.now() - new Date(notification.Timestamp).getTime()) /
    (1000 * 60);

  return typeWeight * 100 - age;
}

async function getPriorityNotifications() {
  try {
    const response = await axios.get(
      NOTIFICATION_API,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );

    const notifications = response.data.notifications;

    const top10 = notifications
      .sort(
        (a, b) =>
          calculateScore(b) - calculateScore(a)
      )
      .slice(0, 10);

    console.log(
      JSON.stringify(
        {
          topNotifications: top10,
        },
        null,
        2
      )
    );
  } catch (error) {
    console.log(
      error.response?.data || error.message
    );
  }
}

getPriorityNotifications();