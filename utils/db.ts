import {
  Arrow,
  CameraBlue,
  CarBlue,
  CarRed,
  Dinner,
  Message,
  Tick,
  classRoom,
} from "../src/assets/images";

export const journalData = [
  {
    id: 1,
    text: "Adam “checked-in” by Asma",
    color: "#18EA71",
    icon: Tick,
    video: false,
  },
  {
    id: 2,
    text: "Don’t Forget to Bring Lunch & a Cap For Tomorrow’s Excursion",
    color: "#50C2C9",
    icon: Message,
    video: classRoom,
  },
  {
    id: 3,
    text: "Yasmine Finished Her Nap",
    color: "#2FFF44",
    icon: CameraBlue,
    video: false,
  },
  {
    id: 4,
    text: "Yasmine Started Her Nap",
    color: "#FF502F",
    icon: CarRed,
    video: false,
  },
  {
    id: 5,
    text: "Yasmine Took Her Lunch",
    color: "#E0B01F",
    icon: CarBlue,
    video: false,
  },
  {
    id: 6,
    text: "Yasmine Changed Diaper",
    color: "#A820CA",
    icon: Dinner,
    video: false,
  },
  {
    id: 7,
    text: "Yasmine Checked-in, By Asma",
    color: "#FF502F",
    icon: Tick,
    video: false,
  },
];

export const HistoryData = [
  {
    id: 1,
    label: "1800 DHS",
    date: "05-January-2023",
    text: "Monthly Payment Due",
    payment: "Unpaid",
  },
  {
    id: 2,
    label: "1800 DHS",
    date: "02-January-2023",
    text: "Monthly Payment Due",
    payment: "Unpaid",
  },
  {
    id: 3,
    label: "1800 DHS",
    date: "08-January-2023",
    text: "Payment Paid",
    payment: "paid",
  },
  {
    id: 4,
    label: "1800 DHS",
    date: "01-January-2023",
    text: "Payment Paid",
    payment: "paid",
  },
  {
    id: 5,
    label: "1800 DHS",
    date: "10-January-2023",
    text: "Payment Paid",
    payment: "paid",
  },
  {
    id: 6,
    label: "1800 DHS",
    date: "10-January-2023",
    text: "Payment Paid",
    payment: "paid",
  },
  {
    id: 7,
    label: "1800 DHS",
    date: "10-January-2023",
    text: "Payment Paid",
    payment: "paid",
  },
  {
    id: 8,
    label: "1800 DHS",
    date: "10-January-2023",
    text: "Payment Paid",
    payment: "paid",
  },
];

export const subjectsData = [
  {
    id: "1",
    title: "Maths",
    description: "Exercise 7 and 9 page 03.",
    room: "Roome C1",
    student: "Priscilla",
  },
  {
    id: "2",
    title: "French",
    description: [
      "Read the text on page 17",
      "Answer the comprehension questions on page 18",
    ],
    room: "Roome C1",
    student: "Priscilla",
  },
  {
    id: "3",
    title: "Physics",
    description: "Prepare the course pages 21 & 22",
    room: "Roome C1",
    student: "Priscilla",
  },
  {
    id: "4",
    title: "English",
    description: "Prepare the course pages 21 & 22",
    room: "Roome C1",
    student: "Priscilla",
  },
  {
    id: "5",
    title: "Maths",
    description: "Prepare the course pages 21 & 22",
    room: "Roome C1",
    student: "Priscilla",
  },
];
export const NewPermissionData = [
  { title: "Create a classroom", isChecked: true },
  { title: "Delete a classroom", isChecked: true },
  { title: "Edit school informations", isChecked: true },

  { title: "Add a student", isChecked: true },
  { title: "Delete a student", isChecked: true },
  { title: "Edit students informations", isChecked: true },

  { title: "Add a parent", isChecked: true },
  { title: "Delete a parent", isChecked: true },
  { title: "Edit parents informations", isChecked: true },

  { title: "Add Teacher/Staff", isChecked: true },
  { title: "Delete Teacher/Staff", isChecked: true },
  { title: "Edit Teachers and staff informations", isChecked: true },

  { title: "Check-In / Check-Out", isChecked: true },
  { title: "Photo / Video", isChecked: true },
  { title: "Nap / Food / Toilet", isChecked: true },
  { title: "Bloc note", isChecked: true },
  { title: "Kudos", isChecked: true },
  { title: "Incident", isChecked: true },
  { title: "Medicaments", isChecked: true },

  { title: "Edit calendars", isChecked: true },
  { title: "Add / See / edit grades", isChecked: true },
  { title: "Add / Edit Homework", isChecked: true },
  { title: "Send documents", isChecked: true },
];
