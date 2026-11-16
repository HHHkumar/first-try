# The Space Between: Capacitance

Narration script, draft 1. English, about 9 minutes. Video 2 of the six-part series.

Lines in plain text are spoken. Lines marked **On screen** describe the picture and are not spoken. **Hero scene** marks a showpiece shot. A timeline strip runs along the bottom of the frame, as in the first video.

---

## 1. Lightning in a jar

**On screen:** Timeline: 1745, 1746. A glass jar half full of water, a wire dipping into it, held in a hand; a second hand reaches for the wire and a spark jumps. **Hero scene:** a great ring of a hundred and eighty figures holding hands, the jar at the gap in the ring; the spark closes the circle and the whole ring flinches at once.

In January seventeen forty-six, a professor in the Dutch city of Leiden held a glass jar of water in one hand and touched a wire with the other. The shock threw him back. He wrote to a friend that he would not take a second one for the whole kingdom of France.

Pieter van Musschenbroek had stumbled onto something new. So had a German cleric, Ewald von Kleist, a few months earlier. For the first time, electricity could be collected, kept, and released all at once.

Within months it was a sensation. In Paris, the Abbé Nollet lined up a hundred and eighty soldiers of the royal guard, hand in hand, and discharged a jar through all of them. They jumped as one.

The Leyden jar was the first capacitor. And the idea inside it is in every circuit you will ever build.

---

## 2. Storing charge

**On screen:** The two plates from the last video, uncharged. A battery connects. Electrons are drawn off one plate, through the battery, and pile onto the other; the field grows between the plates. A voltage read-out for the plates climbs until it matches the battery, and the flow stops. The battery is disconnected and the charge stays.

Take the two metal plates from the last video, facing each other across a gap, and connect a battery between them.

The battery does not create charge. It moves it. Electrons are pulled off one plate, pushed through the wire, and piled onto the other. One plate is left positive. The other becomes negative by exactly the same amount.

As the charge builds, so does the field in the gap, and with it a voltage between the plates. That voltage pushes back against the battery. When it equals the battery's own voltage, the flow stops.

Now disconnect the battery. Nothing changes. The charges stay where they are, each plate holding the other's charge in place across the gap. Electricity, stored.

---

## 3. Capacitance

**On screen:** Timeline: 1837, 1881. Two buckets being filled with water, one narrow, one wide: the same height of water, very different amounts. The plates beside them with charge and voltage read-outs. *C = Q / V* assembles. Michael Faraday's name on the unit. A ladder of sizes: farad, microfarad, nanofarad, picofarad, each with a real component beside it.

How much charge does a given pair of plates hold? That depends on the voltage. Double the voltage, and you get double the charge. The ratio between them never changes, and that ratio is what we call capacitance.

Capacitance is the charge stored for each volt. C equals Q over V.

Think of a bucket. The voltage is the depth of the water, and the charge is the amount. A wide bucket holds far more water at the same depth than a narrow one. Capacitance is the width of the bucket.

Its unit is the farad, named after Michael Faraday: one coulomb for each volt. And one farad is enormous. The capacitors on a circuit board are measured in millionths of a farad, or billionths, or less.

---

## 4. What sets it

**On screen:** The plates grow in area and the stored charge grows with them. Then the gap closes and the charge grows again. *C = ε₀ A / d* assembles. A square metre of plate, a millimetre apart, with its tiny read-out. **Hero scene:** the plates sweeping outward over a city seen from above, until they cover it: the size needed for a single farad.

What decides the capacitance of two plates? Only their shape, and what lies between them.

Make the plates larger, and there is more room for charge to spread out. Double the area, and you double the capacitance.

Bring the plates closer, and something subtler happens. Remember that the voltage is the field multiplied by the gap. With a smaller gap, the same charge produces a smaller voltage. So for the same voltage, you can store more charge. Halve the gap, and the capacitance doubles.

So capacitance equals a constant, times the area, divided by the gap. The constant is called the permittivity of free space, and it is very small.

How small? Take two plates, each one metre square, a millimetre apart. Their capacitance is less than nine billionths of a farad. To reach one farad with that gap, the plates would have to cover more than a hundred square kilometres: the area of a city.

---

## 5. The dielectric

**On screen:** Faraday's two concentric spheres, the space between them filled first with air, then with sulphur, shellac and glass. Then inside the material: molecules as small stretched pairs of charge, turning to line up with the field, and their own small fields opposing it. The read-out for capacitance multiplies. A rolled capacitor unwinding to show metal foil and thin film.

So how do real capacitors manage it? The answer was found by Faraday in eighteen thirty-seven. He filled the gap with different insulating materials, and found that the capacitance went up, by an amount that depended on the material.

An insulator has no free electrons. But its molecules can stretch, or turn. In a field, their positive and negative sides shift a little in opposite directions. Each molecule becomes a tiny pair of charges, and together they produce a field of their own, pointing the other way.

That weakens the field in the gap. A weaker field means a lower voltage for the same charge. And a lower voltage for the same charge is, by definition, a larger capacitance.

We call such a material a dielectric. Paper multiplies the capacitance by about three. Glass, by five to ten. Some ceramics, by thousands.

A dielectric does one more useful thing. It can stand a far stronger field than air before it breaks down, so the plates can sit much closer together. A modern capacitor is thin metal foil, a film a few thousandths of a millimetre thick, and metres of it rolled into a cylinder the size of a fingertip.

---

## 6. Where the energy is

**On screen:** Timeline: 1860s. Charge being carried across the gap one piece at a time, each one harder than the last, with a graph of voltage against charge filling in as a triangle. *W = ½ C V²*. The field in the gap glowing brighter as the energy rises. **Hero scene:** a defibrillator: the capacitor charging with a rising tone bar, then the whole glow in the gap collapsing into a single pulse through a heart.

Charging a capacitor takes work. The first bit of charge crosses easily. But each one after it must be pushed against the voltage already there. The work is not lost. It is stored.

Because the voltage starts at zero and climbs steadily, the average push is half the final voltage. So the energy stored is one half, times the capacitance, times the voltage squared.

Where is that energy? Not in the metal. Maxwell showed that it is in the field itself, in the space between the plates. Empty space, holding energy.

And it can come back very fast. A camera flash takes seconds to charge and a thousandth of a second to fire. A defibrillator charges for a few seconds, then delivers a couple of hundred joules to a heart in a few thousandths of a second.

---

## 7. Capacitors in circuits

**On screen:** A capacitor charging through a resistor: the current starts high and dies away while the voltage climbs along a curve toward the battery voltage, with the time constant marked at sixty-three percent. Then a steady voltage and a still capacitor, against an alternating voltage and charge sloshing back and forth. Two capacitors side by side, then end to end.

A capacitor never charges in an instant, because every circuit has some resistance. At first the current is large, and the voltage climbs quickly. As the capacitor fills, the current fades and the climb slows.

The pace is set by one number: the resistance multiplied by the capacitance. It is called the time constant. After one time constant the capacitor is about two thirds full. After five, it is full for every practical purpose.

Notice something else. Once it is charged, the current stops. A steady voltage cannot drive a current through a capacitor: there is a gap in the way. But a changing voltage keeps charge flowing on and off the plates all the time. A capacitor blocks direct current and passes alternating current.

And when you connect two of them side by side, their areas add, so their capacitances add. Connect them end to end, and the gaps add instead, so the total is smaller than either one.

---

## 8. Everywhere

**On screen:** Timeline: 1749, 1782. A row of Leyden jars wired together, labelled by Franklin's hand: battery. Then, quickly: a smoothing capacitor turning a bumpy voltage into a level one; a bank of capacitors in a substation yard; a finger approaching the grid under a touch screen; a long underground cable drawn as two plates stretched out for kilometres.

Franklin wired several Leyden jars together to store more, and called the set a battery. That is where the word comes from. Volta, in seventeen eighty-two, called the device a condenser, a name you will still find on old drawings.

Today they are everywhere. Capacitors smooth the output of every power supply. Great banks of them stand in substations to correct the power factor. The glass of a touch screen hides a grid of tiny capacitors, and your finger changes them as it comes near.

And capacitance appears where nobody asked for it. Any two conductors with a gap between them form a capacitor. A long underground cable, a core and a sheath with insulation between, has so much of it that simply energising the cable draws a charging current. Engineers have to design for it.

---

## 9. Recap

**On screen:** The timeline, complete. Each idea returns as one image: the jar, the plates filling, the buckets, the closing gap, the turning molecules, the glowing field, the charging curve. The final frame holds *C = Q / V* and *C = ε A / d* over the plates. End card: Like · Share · Subscribe, with the channel handle @electricalmcqs.

So let's put it together.

A capacitor is two conductors with a gap between them. A voltage moves charge from one to the other, and the charge stays.

Capacitance is the charge stored for each volt, measured in farads.

It grows with the area of the plates, shrinks with the gap, and is multiplied by a dielectric.

The energy is stored in the field, and it equals one half C V squared.

A capacitor takes time to charge, blocks a steady current, and passes a changing one.

So far, every charge we have looked at has been standing still, or nearly. Next time, we set them moving, and find a second field that nobody expected.

If this helped you see it, and not just calculate it, please like, share, and subscribe to this channel.
