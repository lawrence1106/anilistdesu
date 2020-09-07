import React from "react";
import { Helmet } from "react-helmet";
import Axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import withReactContent from "sweetalert2-react-content";
import {
  makeStyles,
  Card,
  Button,
  TextField,
  createMuiTheme,
  ThemeProvider,
  Typography,
  Divider,
} from "@material-ui/core";

import cristina from "../Images/cristina.png";
import nezuko from "../Images/nezuko.png";
import rightChar from "../Images/rightChar.png";

import { green } from "@material-ui/core/colors";
import "../Fonts/Bangers-Regular.ttf";

const metaContent =
  "Create your own personal custom anime list with convenient organizing features only here on Anilist Desu!";
const MySwal = withReactContent(Swal);

const useStyles = makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    height: "100vh",
    backgroundColor: "#0093E9",
    backgroundImage: "linear-gradient(225deg, #0093E9 0%, #80D0C7 100%)",
  },
  cristina: {
    height: "150px",
  },
  loginHeader: {
    display: "flex",
    alignItems: "center",
    width: "400px",
    margin: "1.66%",
  },
  headerText: {
    marginLeft: "60px",
  },
  cardContainer: {
    [theme.breakpoints.down("sm")]: {
      width: "300px",
      background: "rgb(206, 220, 242)",
      padding: "10px",
      zIndex: 2,
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
    [theme.breakpoints.up("sm")]: {
      position: "absolute",
      top: "30%",
      left: "15%",
      zIndex: 2,
      padding: "10px",
      background: "rgb(206, 220, 242)",
      display: "flex",
      justifyContent: "center",
      width: "400px",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  cardLogin: {
    margin: "10px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  },
  formItems: {
    margin: "10px",
  },
  cristinaContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    display: "flex",
  },
  nezuko: {
    height: "100px",
  },
  registrationHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bangers: {
    margin: "10px",
    fontFamily: "Bangers",
  },
  autoFocus: {
    autoFocus: "focus",
  },
  aChar: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    height: "100vh",
    position: "absolute",
    right: 0,
    top: 0,
  },
}));

const btnTheme = createMuiTheme({
  palette: {
    secondary: green,
  },
});

export default function Login() {
  const classes = useStyles();

  const [cookies, setCookie] = useCookies(["sessionName"]);

  const validateUser = (event) => {
    event.preventDefault();
    let username = document.querySelector("#login-username").value;
    let password = document.querySelector("#login-password").value;

    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((res) => {
      if (res.data.authenticated === 404) {
        MySwal.fire({
          icon: "warning",
          confirmButtonText: "＝(￣□￣;)⇒",
          html: (
            <Typography className={classes.bangers} variant="h4">
              Account not found!
            </Typography>
          ),
        });
      }

      if (res.data.authenticated === false) {
        MySwal.fire({
          icon: "warning",
          confirmButtonText: "(ﾉ≧ڡ≦)",
          html: (
            <Typography className={classes.bangers} variant="h4">
              Wrong Password!
            </Typography>
          ),
        });
      }

      if (res.data.authenticated === true) {
        MySwal.fire({
          icon: "success",
          confirmButtonText: "(͠≖ ͜ʖ͠≖)👌",
          html: (
            <Typography className={classes.bangers} variant="h4">
              Youkoso kono yaro!
            </Typography>
          ),
          onClose: () => {
            setCookie("sessionName", res.data.sessionName, { path: "/" });
          },
        });
      }
    });
  };
  const register = () => {
    MySwal.fire({
      html: (
        <div>
          <div className={classes.registrationHeader}>
            <div className={classes.formItems}>
              <img
                alt="nezuko-chuwaaan!"
                className={classes.nezuko}
                src={nezuko}
              />
            </div>
            <Typography className={classes.bangers} variant="h3">
              Register
            </Typography>
          </div>
          <Divider />
          <div>
            <form>
              <TextField
                className={classes.formItems}
                label="Full Name"
                id="full-name"
                onChange={function () {
                  Swal.resetValidationMessage();
                }}
              ></TextField>
              <TextField
                className={classes.formItems}
                label="Username"
                id="username"
                onChange={function () {
                  Swal.resetValidationMessage();
                }}
              ></TextField>
              <TextField
                className={classes.formItems}
                label="Password"
                id="password"
                type="password"
                onChange={function () {
                  Swal.resetValidationMessage();
                }}
              ></TextField>
              <TextField
                className={classes.formItems}
                label="Confirm Password"
                id="confirm-password"
                type="password"
                onChange={function () {
                  Swal.resetValidationMessage();
                }}
              ></TextField>
            </form>
          </div>
        </div>
      ),
      confirmButtonText: "Iku yo!",
      showCancelButton: true,
      cancerButtonText: "Cancel",
      preConfirm: () => {
        let fullName = document.querySelector("#full-name").value;
        let username = document.querySelector("#username").value;
        let password = document.querySelector("#password").value;
        let confirmPassword = document.querySelector("#confirm-password").value;

        if (fullName && username && password && confirmPassword) {
          if (password === confirmPassword) {
            Axios.post("http://localhost:3001/regUser", {
              fullName: fullName,
              username: username,
              password: password,
            }).then((res) => {
              if (res.data.results) {
                MySwal.fire({
                  icon: "success",
                  html: (
                    <Typography className={classes.bangers} variant="h4">
                      Account Created!
                    </Typography>
                  ),
                  confirmButtonText: "Noice!",
                });
              } else {
                MySwal.fire({
                  icon: "warning",
                  html: (
                    <Typography className={classes.bangers} variant="h4">
                      Oops! Something went wrong!
                    </Typography>
                  ),
                  confirmButtonText: "(ㆆ_ㆆ)",
                });
              }
            });
          } else {
            Swal.showValidationMessage("Password does not match!");
          }
        } else {
          Swal.showValidationMessage("Please fill in the necessary fields!");
        }
      },
    });
  };
  return (
    <div>
      <Helmet>
        <title>Anilist Desu! - Youkoso!</title>
        <meta name="description" content={metaContent}></meta>
      </Helmet>
      <div className={classes.container}>
        <Card className={classes.cardContainer}>
          <div className={classes.cristinaContainer}>
            <img src={cristina} className={classes.cristina} alt="Cristina!" />
          </div>
          <Card className={classes.cardLogin}>
            <form onSubmit={validateUser}>
              <TextField
                className={classes.formItems}
                label="Username"
                id="login-username"
                required
              ></TextField>
              <TextField
                className={classes.formItems}
                label="Password"
                type="password"
                id="login-password"
                required
              ></TextField>
              <div className={classes.actions}>
                <ThemeProvider theme={btnTheme}>
                  <Button
                    className={classes.formItems}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Login
                  </Button>
                  <Button
                    className={classes.formItems}
                    variant="contained"
                    color="secondary"
                    onClick={register}
                  >
                    Register
                  </Button>
                </ThemeProvider>
              </div>
            </form>
          </Card>
        </Card>
        <img src={rightChar} className={classes.aChar} alt="rightChar" />
      </div>
    </div>
  );
}
