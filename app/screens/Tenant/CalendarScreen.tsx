import * as React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "components/Themed";

import { Calendar } from "react-native-calendars";
import Circle from "components/Circle";
import { useEffect, useState } from "react";

const CustomHeader = (props: any) => {
  const { calendarRef, date } = props;

  const monthName = Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);
  const year = date.getFullYear();

  return (
    <View style={calendarStyles.headerContainer}>
      <View>
        <Text style={calendarStyles.year}>{year} Calendar</Text>
        <Text style={calendarStyles.monthName}>{monthName}</Text>
      </View>
      <View style={calendarStyles.arrowSection}>
        {calendarRef.header.current.props.renderArrow("left")}
        {calendarRef.header.current.props.renderArrow("right")}
      </View>
    </View>
  );
};

const CustomArrow = (props: any) => {
  const { calendarRef, direction } = props;

  const isLeft = direction === "left";
  const onPressArrow = isLeft
    ? calendarRef.header.current.onPressLeft
    : calendarRef.header.current.onPressRight;
  const marginRight = isLeft ? 15 : 0;

  const circleStyles = {
    borderColor: "black",
    marginRight: marginRight,
  };

  return (
    <TouchableOpacity onPress={onPressArrow}>
      <Circle style={circleStyles}>
        {isLeft ? (
          <Image
            source={require("assets/images/leftArrow.png")}
            style={[calendarStyles.img, { marginRight: 2 }]}
          />
        ) : (
          <Image
            source={require("assets/images/rightArrow.png")}
            style={[calendarStyles.img, { marginLeft: 2 }]}
          />
        )}
      </Circle>
    </TouchableOpacity>
  );
};

export default function CalendarScreen() {
  const calendarRef = React.useRef();
  const [calendarRefCurrent, setCalendarRefCurrent] = useState(
    calendarRef.current,
  );

  useEffect(() => {
    setCalendarRefCurrent(calendarRef.current);
  }, [calendarRef]);

  // traditional calendar
  return (
    <>
      <Calendar
        hideArrows={true}
        ref={calendarRef}
        renderArrow={(direction) =>
          calendarRefCurrent && (
            <CustomArrow
              direction={direction}
              calendarRef={calendarRefCurrent}
            />
          )
        }
        renderHeader={(date: Date) => {
          return (
            calendarRefCurrent && (
              <CustomHeader date={date} calendarRef={calendarRefCurrent} />
            )
          );
        }}
        style={[
          { height: 500, paddingTop: 20, paddingLeft: 20, paddingRight: 20 },
        ]}
      />
    </>
  );
}

const calendarStyles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  monthName: {
    backgroundColor: "white",
    color: "black",
    fontSize: 30,
    fontWeight: "600",
    lineHeight: 36,
  },
  year: {
    fontSize: 15,
    backgroundColor: "white",
    color: "#BDBDBD",
    paddingBottom: 5,
  },
  arrowSection: {
    flexDirection: "row",
    alignSelf: "flex-end",
    backgroundColor: "white",
  },
  img: {
    backgroundColor: "white",
    width: 8,
    height: 15,
  },
});
