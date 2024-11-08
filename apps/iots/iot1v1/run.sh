# Build the PlatformIO project
platformio run -e esp32doit-devkit-v1

# Create a 4MB dummy flash image
# dd if=/dev/zero of=esp32_flash.img bs=1M count=4

# Write the firmware to the flash image
dd if=.pio/build/esp32doit-devkit-v1/firmware.bin of=esp32_flash.img conv=notrunc

# Run the firmware in QEMU using the dummy flash image
qemu-system-xtensa -nographic -machine esp32 -drive file=esp32_flash.img,if=mtd,format=raw -serial mon:stdio
