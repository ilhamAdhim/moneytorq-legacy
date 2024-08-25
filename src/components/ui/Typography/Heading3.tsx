
interface ITypographyH3 {
    children: React.ReactNode;
}


export function TypographyH3({
    children
}: ITypographyH3) {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
    )
  }
  