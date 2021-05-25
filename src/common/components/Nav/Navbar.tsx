import {
  AppBar,
  Toolbar,
  IconButton,
  makeStyles,
  Theme,
  createStyles,
  Typography,
  InputBase,
  fade,
  Grow,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { useState } from "react";
import SideDrawer, { drawerWidth } from "../SideDrawer/SideDrawer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    page: {
      display: "flex",
    },
    root: {
      flexGrow: 1,
      marginBottom: theme.spacing(2),
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    inputRoot: {
      color: "inherit",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: 0,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    },
  })
);

export default function FullNavbar(props: any) {
  const classes = useStyles();
  const [sidebarIsOpen, sidebarSetOpen] = useState(false);

  const handleDrawerOpen = () => {
    sidebarSetOpen(true);
  };

  const handleDrawerClose = () => {
    sidebarSetOpen(true);
  };

  return (
    <div>
      <div className={classes.root}>
        <AppBar
          position="static"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: sidebarIsOpen,
          })}
        >
          <Toolbar>
            <Grow
              in={!sidebarIsOpen}
              {...(!sidebarIsOpen ? { timeout: 750 } : { timeout: 350 })}
            >
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
            </Grow>
            <Typography variant="h6" className={classes.title}>
              Factorio Tools
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>
          </Toolbar>
        </AppBar>
        <SideDrawer open={sidebarIsOpen} setOpen={sidebarSetOpen}></SideDrawer>
      </div>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: sidebarIsOpen,
        })}
      >
        {props.children}
      </div>
    </div>
  );
}
