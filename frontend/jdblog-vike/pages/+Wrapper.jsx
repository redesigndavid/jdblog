export default function Wrapper({ children }) {
  return (
    <>
    <div className="bg-stone-50 dark:bg-stone-950 max-w-dvw overflow-clip">
      {children}
    </div>
    </>
  );
}
