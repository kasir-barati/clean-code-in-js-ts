import { DateTime } from 'luxon';

// #region Base

type MotionDto = StaticMotionDto | MovingMotionDto;

interface StaticMotionDto {
  sensorId: string;
  deviceId: string;
  timestamp: Date;
  sensitivity: string;
  status: 'static';
}

interface MovingMotionDto {
  sensorId: string;
  deviceId: string;
  timestamp: Date;
  sensitivity: string;
  status: 'moving';
  speed: number;
}

interface MeterDto {
  sensorId: string;
  deviceId: string;
  powerConsumption: number;
  maximumPowerConsumption: number;
}

// #endregion

// #region Types

/**
 * Decompose Conditional
 * @see https://refactoring.guru/decompose-conditional
 */
function isPowerConsumptionHigh(meterDto: MeterDto) {
  return meterDto.powerConsumption > meterDto.maximumPowerConsumption;
}

/**
 * Assertion signatures
 *
 * @see https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/?nsl_bypass_cache=414792c1e12c19676682d87aee3fa05f#assertion-functions
 */
function assertIsMoving(
  motionDto: MotionDto,
): asserts motionDto is MovingMotionDto {
  if (motionDto.status === 'moving' && !motionDto.speed) {
    throw 'NotMoving!';
  }
}

/**
 * Type predicates + type guards
 *
 * @see https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates).
 * @see https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 */
function isStatic(
  motionDto: MotionDto,
): motionDto is StaticMotionDto {
  return motionDto.status === 'static';
}

// #region Usage

export async function sanityCheckSensitivity(motionDto: MotionDto) {
  if (isStatic(motionDto)) {
    const lastMovingRecord =
      await motionRepository.getLastMovingRecord(motionDto.deviceId);
    const lastMovingDate = DateTime.fromISO(
      lastMovingRecord.timestamp,
    );
    const currentStaticDate = DateTime.fromISO(
      motionDto.timestamp.toISOString(),
    );
    const diff = currentStaticDate.diff(lastMovingDate, 'hours');

    if (diff.hours > 12) {
      console.warn`Sensitivity level is too low for device ${motionDto.deviceId}!`;
    }

    return;
  }

  const lastStaticRecord = await motionRepository.getLastStaticRecord(
    motionDto.deviceId,
  );
  const lastStaticDate = DateTime.fromISO(lastStaticRecord.timestamp);
  const currentMovingDate = DateTime.fromISO(
    motionDto.timestamp.toISOString(),
  );
  const diff = currentMovingDate.diff(lastStaticDate, 'hours');

  if (diff.hours > 12) {
    console.warn`Sensitivity level is too high for device ${motionDto.deviceId}!`;
  }
}

export function notifyMeOnMovingHighConsumptionDevice(
  motionDto: MotionDto,
  meterDto: MeterDto,
) {
  if (!isPowerConsumptionHigh(meterDto)) {
    return;
  }

  assertIsMoving(motionDto);

  console.warn`Current power consumption for device ${motionDto.deviceId} is high!`;
  console.warn`This could be caused because it is moving according to sensor ${motionDto.sensorId} with the speed of ${motionDto.speed}`;
}

// #endregion
