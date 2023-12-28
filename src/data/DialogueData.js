export const DialogueData = [
  {
    id: 0,
    title: "Dialogue  0",
  },
];

export const AppendDataToDD = (data) => {
  DialogueData.push(data);
  console.log(DialogueData);
};
