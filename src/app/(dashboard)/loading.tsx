import LoadingScreen from "@/components/loadingScreen";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="opacity-50">
      <LoadingScreen loading={true} />
    </div>
  );
}
