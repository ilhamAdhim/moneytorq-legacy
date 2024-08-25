
interface ITypographyParagraph {
    children: React.ReactNode;
}


export function Paragraph({
    children
}: ITypographyParagraph) {
    return (
        <p className="leading-7 [&:not(:first-child)]:mt-6">
            {children}
        </p>
    )
}
