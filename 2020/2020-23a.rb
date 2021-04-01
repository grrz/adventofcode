def _input(m)
	prev = nil
	first = nil
	t = [nil] + [0] * 9
	# '389125467'.split('').map(&:to_i).each { |i| # test
	'398254716'.split('').map(&:to_i).each { |i|
		if prev
			t[prev] = i
		else
			first = i
		end
		prev = i
	}
	(10..m).each { |i| t[prev] = i;	prev = i }

	t[prev] = first
	[t, first]
end

MAX = 1_000_000
# MAX = 9
$t, $i = _input(MAX)


def _dest(d, c3)
	d -= 1
	d = MAX if d == 0
	c3.include?(d) ? _dest(d, c3) : d
end


def step
	# cut 3 next cups
	c3 = [ $t[$i], $t[$t[$i]], $t[$t[$t[$i]]] ]
	$t[$i] = $t[c3[2]]

	# next cup
	dest = _dest($i, c3)

	# insert 3 cut cups after dest
	$t[c3[2]] = $t[dest]
	$t[dest] = c3[0]

	# move index
	$i = $t[$i]
end

def res1(stop)
	r = ''
	i = $t[stop]
	while i != stop
		r += i.to_s
		i = $t[i]
	end
	r
end


t1 = Time.now
# for n in (1..1000)
for n in (1..10_000_000)
	step()
	p n if n % 100_000 == 0
end
t2 = Time.now

#1
# p res1(1)
#2
p "#{$i}: #{$t[1]} * #{$t[$t[1]]} = #{$t[1] * $t[$t[1]]}"

p "time: #{t2-t1} s"