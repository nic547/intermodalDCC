#pragma once

#include <Arduino.h>

namespace signalGeneration {
void setup();

/// @brief "resets" the current packet so that it will be sent once again. Used when the output is stopped.
void resetCurrentPacket();

extern volatile uint8_t nextData[6];
extern volatile int nextDataLenght;
extern volatile bool nextDataIsReady;
extern volatile bool nextDataIsUsed;

extern int debugWrittenBit;
extern int debugBitDuration;
}; // namespace signalGeneration
