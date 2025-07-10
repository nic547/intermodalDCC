

#ifdef ARDUINO_ARCH_RENESAS

#include "hardwareInterface.hpp"
#include <Arduino.h>
#include <FspTimer.h>

namespace hardwareInterface {

FspTimer dcc_timer;

constexpr float TIMER_RATE = 1'000'000.0f / 58.0f;

void (*signal_callback)() = nullptr;

bool beginTimer(float rate, void (*timer_callback)(timer_callback_args_t *));

void enable_b() {
  R_PORT4->POSR = (1 << 11);
}

void disable_b() {
  R_PORT4->PORR = (1 << 11);
}

void direction_b_on() {
  R_PORT1->POSR = (1 << 2);
};
void direction_b_off() {
  R_PORT1->PORR = (1 << 2);
}


void callback(timer_callback_args_t *p_args) {
  signal_callback();
}

void setUpHardware(void (*timer_callback)()) {
  pinMode(13, OUTPUT);
  pinMode(11, OUTPUT);

  enable_b();

  signal_callback = timer_callback;

  Serial.print(beginTimer(TIMER_RATE, callback));
}

bool beginTimer(float rate, void (*timer_callback)(timer_callback_args_t *)) {
  uint8_t timer_type = GPT_TIMER;
  int8_t tindex = FspTimer::get_available_timer(timer_type);
  if (tindex < 0) {
    tindex = FspTimer::get_available_timer(timer_type, true);
  }
  if (tindex < 0) {
    return false;
  }

  FspTimer::force_use_of_pwm_reserved_timer();

  Serial.println("Beep");

  if (!dcc_timer.begin(TIMER_MODE_PERIODIC, timer_type, tindex, rate, 0.0f, timer_callback)) {
    return false;
  }

  Serial.println("Boop");

  if (!dcc_timer.setup_overflow_irq()) {
    return false;
  }

  if (!dcc_timer.open()) {
    return false;
  }

  if (!dcc_timer.start()) {
    return false;
  }
  return true;
}

void startTimer() {
  dcc_timer.start();
}

void stopTimer() {
  dcc_timer.stop();
}

} // namespace hardware_interface

#endif