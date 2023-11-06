import React from "react";

const Pagination_new = ({ pagination, current_page, AllUser }) => {
  return (
      <div className="pagination-wrap">
          <div className="d-flex align-items-center">
             <div className="prev-next-btn" style={{cursor:current_page!==1?'pointer':'no-drop'}} onClick={() => current_page!==1 ?AllUser(current_page - 1):null}>
               Previous
             </div>
             <div className="prev-next-btn ms-3" style={{cursor:current_page!==pagination?'pointer':'no-drop'}} onClick={() =>current_page!==pagination? AllUser(current_page + 1):null}>
               Next
             </div>
          </div>
          <div className="pagination-count">
           {`page ${current_page} of ${pagination}`}
          </div>
      </div>
  );
};

export default Pagination_new;
