#pragma once

#include <Arduino.h>

namespace signalGeneration {
void setup();

/// @brief "resets" the current packet so that it will be sent once again. Used when the output is stopped.
void resetCurrentPacket();

extern uint8_t nextData[6];
extern int nextDataLenght;
extern bool nextDataIsReady;
extern bool nextDataIsUsed;

extern int debugWrittenBit;
extern int debugBitDuration;
}; // namespace signalGeneration
