import ReportInput from "./ReportInput";
function CheckPhisherStatus() {
  return (
    <div className="pt-20 w-[961px] m-auto">
      <h1 className="text-[62px] pb-5 font-[600]">Check Phisher Status</h1>
      <h6 className="text-[#101828] text-xs mb-10">
        An alliance of good-hearted phish, aiming to eliminate phishers.
      </h6>
      <ReportInput />
    </div>
  );
}

export default CheckPhisherStatus;