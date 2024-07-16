const formatDate = (date) => {
  return {
    day: {
      numeric: dayjs(date).format("DD"),
      week: {
        short: dayjs(date).format("ddd"),
        long: dayjs(date).format("dddd"),
      },
    },
    month: dayjs(date).format("MMMM"),
    hour: dayjs(date).format("HH:mm"),
  };
};

let activities = [];

const createActivityItem = (activity) => {
  let input = `
  <input 
  onchange="completeActivity(event)"
  value="${activity.date}"
  type="checkbox" 
  `;

  if (activity.finished) {
    input += "checked";
  }

  input += ">";

  const format = formatDate(activity.date);

  return `
  <div class="card-bg">
    ${input}

    <div>
    <svg class="active" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.50008 9.99999L9.16675 11.6667L12.5001 8.33332M18.3334 9.99999C18.3334 14.6024 14.6025 18.3333 10.0001 
18.3333C5.39771 18.3333 1.66675 14.6024 1.66675 9.99999C1.66675 5.39762 5.39771 1.66666 10.0001 1.66666C14.6025 1.66666 
18.3334 5.39762 18.3334 9.99999Z" stroke="#BEF264" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<svg class="inactive" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.41664 1.81833C9.46249 1.61593 10.5374 1.61593 11.5833 1.81833M11.5833 18.1817C10.5374 18.3841 9.46249 18.3841 
8.41664 18.1817M14.6741 3.10083C15.5587 3.70019 16.3197 4.46406 16.9158 5.35083M1.8183 11.5833C1.6159 10.5375 1.6159 9.46252 
1.8183 8.41667M16.8991 14.6742C16.2998 15.5587 15.5359 16.3198 14.6491 16.9158M18.1816 8.41667C18.384 9.46252 18.384 10.5375 
18.1816 11.5833M3.1008 5.32583C3.70016 4.44128 4.46403 3.68023 5.3508 3.08417M5.3258 16.8992C4.44124 16.2998 3.6802 15.5359 
3.08414 14.6492" stroke="#A1A1AA" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


      <span>${activity.name}</span>
    </div>

    <time class="short">
      ${format.day.week.short}.
      ${format.day.numeric} <br>
      ${format.hour}
    </time>

    <time class="full">
      ${format.day.week.long}, 
      dia ${format.day.numeric} 
      de ${format.month} 
      às ${format.hour}h
    </time>
  </div>
  `;
};

const updateActivitiesList = () => {
  const section = document.querySelector("section");
  section.innerHTML = "";

  if (activities.length === 0) {
    section.innerHTML = `<p>Nenhuma atividade planejada.</p>`;
    return;
  }

  for (let activity of activities) {
    section.innerHTML += createActivityItem(activity);
  }
};

updateActivitiesList();

const addActivity = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const name = formData.get("activity");
  const day = formData.get("day");
  const hour = formData.get("hour");
  const date = new Date(`${day} ${hour}`);

  const newActivity = {
    name,
    date,
    finished: false,
  };

  const activityExists = activities.find((activity) => {
    return activity.date.getTime() === newActivity.date.getTime();
  });

  if (activityExists) {
    return alert("Day/Time not available.");
  }

  activities = [newActivity, ...activities];
  updateActivitiesList();

  event.target.reset();
};

const createDaysSelection = () => {
  const days = ["2024-01-12", "2024-01-13", "2024-01-14"];

  let daysSelection = "";

  for (let day of days) {
    const format = formatDate(day);
    const formattedDay = `${format.day.numeric} de ${format.month}`;

    daysSelection += `<option value='${day}'>${formattedDay}</option>`;
  }

  document.querySelector("select[name='day']").innerHTML = daysSelection;
};

createDaysSelection();

const createHoursSelection = () => {
  let availableHours = "";

  for (let i = 6; i < 23; i++) {
    const hour = String(i).padStart(2, "0");
    availableHours += `<option value="${hour}:00">${hour}:00</option>`;
    availableHours += `<option value="${hour}:30">${hour}:30</option>`;
  }

  document.querySelector("select[name='hour']").innerHTML = availableHours;
};

createHoursSelection();

const completeActivity = (event) => {
  const input = event.target;
  const inputDate = new Date(input.value);

  const activity = activities.find((activity) => {
    return activity.date.getTime() === inputDate.getTime();
  });

  if (!activity) {
    return;
  }

  activity.finished = !activity.finished;
  updateActivitiesList();
};
