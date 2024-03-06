import Head from 'next/head';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import wrapper from '../store/configureStore';
import './styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const NodeBird = ({ Component }) => {

  const darkModeHandler = () => {
    const isDarkMode = sessionStorage.getItem("isDarkMode") === 'true' ? false : true;
    if (isDarkMode) {
        document.body.setAttribute("data-theme", "dark");
    } else {
        document.body.setAttribute("data-theme", "light");
    }
    sessionStorage.setItem("isDarkMode",isDarkMode);
};

  return (
    <>
      <Head>
        <title>NodeBird</title>
      </Head>
      <Component darkModeHandler={darkModeHandler}/>
    </>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(NodeBird);
