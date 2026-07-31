const page = async () => {
  const res = await fetch("http://localhost:8000/test/check/");
  const data = await res.json();
  console.log("response is", data);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      A Next level POS system
    </div>
  );
};

export default page;
