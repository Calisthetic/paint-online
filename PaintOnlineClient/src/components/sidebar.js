export default function Sidebar(props) {
  return (
    <aside className="sidebar">
      <button className="btn-open-sidebar">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z"/>
        </svg>
      </button>
      <input type="color" onInput={(e) => {props.setColor(e.target.value)}}></input>
      <button onClick={() => {props.setType("line")}}>line</button>
      <button onClick={() => {props.setType("rectangle")}}>rectangle</button>
      <button onClick={() => {props.setType("ellipse")}}>ellipse</button>
    </aside>
  )
}