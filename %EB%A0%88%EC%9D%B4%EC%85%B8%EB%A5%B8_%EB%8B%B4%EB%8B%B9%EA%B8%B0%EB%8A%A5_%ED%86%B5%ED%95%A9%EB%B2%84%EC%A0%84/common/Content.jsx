import './Content.css'

interface ContentProps {
  children: React.ReactNode;
}

export const Content = ({children}: ContentProps) => {
  return <div className="content">{children}</div>
}

export default Content;
