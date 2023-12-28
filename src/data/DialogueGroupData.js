export const DialogueGropuData = [
  {
    id: 0,
    title: "Dialogue Group 0",
  },
  {
    id: 1,
    title: "Dialogue Group 1",
  },
  {
    id: 2,
    title: "Dialogue Group 2",
  },
  {
    id: 3,
    title: "Dialogue Group 3",
  },
];

export const AppendDataToDGD = (data) => {
  DialogueGropuData.push(data);
  console.log(DialogueGropuData);
};
