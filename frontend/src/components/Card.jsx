function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-600">
        {title}
      </h2>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>
    </div>
  );
}

export default Card;