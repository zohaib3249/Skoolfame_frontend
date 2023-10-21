import React from "react";
import { Button, Pagination } from "react-bootstrap";

const Pagination_new = ({ pagination, current_page, AllUser }) => {

  return (
    <>
      <div className="last-one d-flex align-items-center justify-content-between mt-5">
        <div className="pagination_main">
          {
            (pagination > 0) &&
            <Pagination className="align-items-center">
              <Pagination.Prev onClick={() => AllUser(1)} disabled={current_page === 1 ? true : false}>

                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.50788 -6.11966e-07L0.507813 7L7.50788 14L9.49361 12.0141L4.47941 7L9.49361 1.98587L7.50788 -6.11966e-07Z" fill={current_page === 1 ? "#a7a7a7" : "#F39C1B"} />
                </svg>
              </Pagination.Prev>


              {
                (current_page > 2) && (pagination !== 3) &&
                <Pagination.Ellipsis onClick={() => AllUser(current_page - 2)} />
              }

              {
                (current_page == pagination) && (pagination > 2) &&
                <Pagination.Item
                  active={current_page === (current_page - 2)}
                  onClick={() => AllUser(current_page - 2)}
                >
                  {current_page - 2}
                </Pagination.Item>
              }

              {
                (current_page != 1) &&
                <Pagination.Item
                  active={current_page === (current_page - 1)}
                  onClick={() => AllUser(current_page - 1)}
                >
                  {current_page - 1}
                </Pagination.Item>
              }

              <Pagination.Item
                active={current_page === (current_page)}
                onClick={() => AllUser(current_page)}
              >
                {current_page}
              </Pagination.Item>
              {
                (current_page !== pagination) &&
                <Pagination.Item
                  active={current_page === (current_page + 1)}
                  onClick={() => AllUser(current_page + 1)}
                >
                  {current_page + 1}
                </Pagination.Item>
              }
              {
                (current_page == 1) && (pagination > (current_page + 1)) &&
                <Pagination.Item
                  active={current_page === (current_page + 2)}
                  onClick={() => AllUser(current_page + 2)}
                >
                  {current_page + 2}
                </Pagination.Item>
              }

              {
                (pagination > (current_page + 1)) && (pagination !== 3) &&
                <Pagination.Ellipsis onClick={() => AllUser(current_page + 2)} />
              }
              <Pagination.Next onClick={() => AllUser(pagination)} disabled={current_page === pagination ? true : false}>

                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.49212 -6.11966e-07L9.49219 7L2.49212 14L0.506388 12.0141L5.52059 7L0.506388 1.98587L2.49212 -6.11966e-07Z" fill={current_page === pagination ? "#a7a7a7" : "#F39C1B"} />
                </svg>

              </Pagination.Next>
            </Pagination>
          }
        </div>

      </div>
    </>
  );
};

export default Pagination_new;
