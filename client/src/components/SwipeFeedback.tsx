import { useMatchStore } from "../store/useMatchStore";

const getFeetbackStyle = (swipeFeedback: string) => {
  if (swipeFeedback === "liked") return "text-green-500";
  if (swipeFeedback === "passed") return "text-red-500";
  if (swipeFeedback === "matched") return "text-pink-500";
};

const getFeedbackText = (swipeFeedback: string) => {
  if (swipeFeedback === "liked") return "Liked!";
  if (swipeFeedback === "passed") return "Passed";
  if (swipeFeedback === "matched") return "It's a match!";
};

const SwipeFeedback = () => {
  const { swipeFeedback } = useMatchStore();
  return (
    <div
      className={`absolute top-10 left-0 right-0 text-center text-2xl font-bold ${getFeetbackStyle(
        swipeFeedback
      )}`}
    >
      {getFeedbackText(swipeFeedback)}
    </div>
  );
};

export default SwipeFeedback;
