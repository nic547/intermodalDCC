
/// @brief Contains functions interfacing with the hardware.
namespace hardwareInterface {

/// @brief Enables the second h-bridge channel.
void enable_b();
/// @brief Disables the second h-bridge channel.
void disable_b();
/// @brief Sets the direction of the second h-bridge channel to forward aka "on".
void direction_b_on();
/// @brief Sets the direction of the second h-bridge channel to reverse aka "off".
void direction_b_off();

/// @brief Sets up the hardware by configuring pins, timers, etc.
/// @param timer_callback 
void setUpHardware(void (*timer_callback)());

/// @brief Starts the timer for signal generation. Use only after `setUpHardware` has been called.
void startTimer();

/// @brief Stops the timer for signal generation. Use only after `setUpHardware` has been called.
void stopTimer();
} // namespace hardware_interface