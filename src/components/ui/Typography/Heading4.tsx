
interface ITypographyH4 {
  children: React.ReactNode;
}


export function TypographyH4({
  children
}: ITypographyH4) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  )
}
