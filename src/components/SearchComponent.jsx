import { useContext } from "react";

import { LoginProvider } from "../useContext/LoginContext";

function SearchComponent() {
  const { searchText, setSearchText } = useContext(LoginProvider);
  return (
    <div>
      <input
        type="text"
        className="search--input"
        value={searchText}
        placeholder="Search user by username"
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}

export default SearchComponent;
