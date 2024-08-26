import "./message.css";

const Message = ({own}) => {
	const PF = import.meta.env.VITE_PUBLIC_FOLDER;

	return (
		<div className={own? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={PF + 'person/1.jpg'}
          alt=""
        />
        <p className="messageText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus quasi dicta ipsa ut nobis nulla, veritatis quam ea accusamus quod at. Quam, cupiditate! Quibusdam officia maiores quisquam rerum quas dolorum odio nihil necessitatibus labore impedit quia aperiam numquam libero doloribus, neque veniam incidunt! Et neque obcaecati nihil, impedit repellat commodi!</p>
      </div>
      <div className="messageBottom">1 час назад</div>
    </div>
  );
}

export default Message;
