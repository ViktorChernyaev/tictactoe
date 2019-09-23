import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  jsutify-content: flex-start;
`;

export const Square = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  text-align: center;
  vertical-lign: top;
  font-size: 10px;
  line-height: 12px;
  cursor: ${props => props.clickable ? "pointer" : "not-allowed"};
`
